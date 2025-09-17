// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract QuestSealedRewards is SepoliaConfig {
    using FHE for *;
    
    struct Quest {
        euint32 questId;
        euint32 maxParticipants;
        euint32 currentParticipants;
        euint32 rewardPool;
        euint32 completionThreshold;
        euint32 completedParticipants;
        bool isActive;
        bool isCompleted;
        bool rewardsRevealed;
        string title;
        string description;
        address organizer;
        uint256 startTime;
        uint256 endTime;
        uint256 revealTime;
    }
    
    struct Participant {
        euint32 participantId;
        address participantAddress;
        bool hasJoined;
        bool hasCompleted;
        euint32 contribution;
        uint256 joinTime;
        uint256 completionTime;
    }
    
    struct Reward {
        euint32 rewardId;
        euint32 amount;
        address recipient;
        bool isClaimed;
        uint256 claimTime;
    }
    
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => mapping(address => Participant)) public participants;
    mapping(uint256 => Reward[]) public questRewards;
    mapping(address => euint32) public participantReputation;
    mapping(address => euint32) public organizerReputation;
    
    uint256 public questCounter;
    uint256 public participantCounter;
    uint256 public rewardCounter;
    
    address public owner;
    address public verifier;
    
    event QuestCreated(uint256 indexed questId, address indexed organizer, string title);
    event ParticipantJoined(uint256 indexed questId, address indexed participant);
    event QuestCompleted(uint256 indexed questId, address indexed participant);
    event QuestFinished(uint256 indexed questId);
    event RewardsRevealed(uint256 indexed questId);
    event RewardClaimed(uint256 indexed questId, address indexed recipient, uint32 amount);
    event ReputationUpdated(address indexed user, uint32 reputation);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createQuest(
        string memory _title,
        string memory _description,
        uint256 _maxParticipants,
        uint256 _duration,
        externalEuint32 rewardPool,
        externalEuint32 completionThreshold,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Quest title cannot be empty");
        require(_maxParticipants > 0, "Max participants must be positive");
        require(_duration > 0, "Duration must be positive");
        
        uint256 questId = questCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalRewardPool = FHE.fromExternal(rewardPool, inputProof);
        euint32 internalCompletionThreshold = FHE.fromExternal(completionThreshold, inputProof);
        
        quests[questId] = Quest({
            questId: FHE.asEuint32(0), // Will be set properly later
            maxParticipants: FHE.asEuint32(_maxParticipants),
            currentParticipants: FHE.asEuint32(0),
            rewardPool: internalRewardPool,
            completionThreshold: internalCompletionThreshold,
            completedParticipants: FHE.asEuint32(0),
            isActive: true,
            isCompleted: false,
            rewardsRevealed: false,
            title: _title,
            description: _description,
            organizer: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            revealTime: 0
        });
        
        emit QuestCreated(questId, msg.sender, _title);
        return questId;
    }
    
    function joinQuest(
        uint256 questId,
        externalEuint32 contribution,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(quests[questId].organizer != address(0), "Quest does not exist");
        require(quests[questId].isActive, "Quest is not active");
        require(block.timestamp <= quests[questId].endTime, "Quest has ended");
        require(!participants[questId][msg.sender].hasJoined, "Already joined this quest");
        
        // Check if quest is full
        // Note: In a real implementation, we'd need to decrypt currentParticipants
        // For now, we'll assume the check is done off-chain
        
        uint256 participantId = participantCounter++;
        euint32 internalContribution = FHE.fromExternal(contribution, inputProof);
        
        participants[questId][msg.sender] = Participant({
            participantId: FHE.asEuint32(0), // Will be set properly later
            participantAddress: msg.sender,
            hasJoined: true,
            hasCompleted: false,
            contribution: internalContribution,
            joinTime: block.timestamp,
            completionTime: 0
        });
        
        // Update quest participant count
        quests[questId].currentParticipants = FHE.add(
            quests[questId].currentParticipants, 
            FHE.asEuint32(1)
        );
        
        emit ParticipantJoined(questId, msg.sender);
        return participantId;
    }
    
    function completeQuest(
        uint256 questId,
        externalEuint32 completionProof,
        bytes calldata inputProof
    ) public {
        require(participants[questId][msg.sender].hasJoined, "Not a participant");
        require(!participants[questId][msg.sender].hasCompleted, "Already completed");
        require(quests[questId].isActive, "Quest is not active");
        
        euint32 internalProof = FHE.fromExternal(completionProof, inputProof);
        
        // Mark participant as completed
        participants[questId][msg.sender].hasCompleted = true;
        participants[questId][msg.sender].completionTime = block.timestamp;
        
        // Update quest completion count
        quests[questId].completedParticipants = FHE.add(
            quests[questId].completedParticipants,
            FHE.asEuint32(1)
        );
        
        emit QuestCompleted(questId, msg.sender);
        
        // Check if quest should be finished
        // Note: In a real implementation, we'd decrypt and compare values
        // For now, we'll assume this is handled off-chain
    }
    
    function finishQuest(uint256 questId) public {
        require(quests[questId].organizer == msg.sender, "Only organizer can finish quest");
        require(quests[questId].isActive, "Quest is not active");
        require(block.timestamp > quests[questId].endTime, "Quest has not ended");
        
        quests[questId].isActive = false;
        quests[questId].isCompleted = true;
        
        emit QuestFinished(questId);
    }
    
    function revealRewards(uint256 questId) public {
        require(quests[questId].organizer == msg.sender, "Only organizer can reveal rewards");
        require(quests[questId].isCompleted, "Quest must be completed");
        require(!quests[questId].rewardsRevealed, "Rewards already revealed");
        
        quests[questId].rewardsRevealed = true;
        quests[questId].revealTime = block.timestamp;
        
        emit RewardsRevealed(questId);
    }
    
    function claimReward(
        uint256 questId,
        externalEuint32 rewardAmount,
        bytes calldata inputProof
    ) public {
        require(quests[questId].rewardsRevealed, "Rewards not yet revealed");
        require(participants[questId][msg.sender].hasCompleted, "Must complete quest to claim");
        
        euint32 internalAmount = FHE.fromExternal(rewardAmount, inputProof);
        
        uint256 rewardId = rewardCounter++;
        questRewards[questId].push(Reward({
            rewardId: FHE.asEuint32(0), // Will be set properly later
            amount: internalAmount,
            recipient: msg.sender,
            isClaimed: true,
            claimTime: block.timestamp
        }));
        
        emit RewardClaimed(questId, msg.sender, 0); // Amount will be decrypted off-chain
    }
    
    function updateReputation(address user, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        // Determine if user is participant or organizer based on context
        if (participants[questCounter - 1][user].participantAddress == user) {
            participantReputation[user] = reputation;
        } else {
            organizerReputation[user] = reputation;
        }
        
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getQuestInfo(uint256 questId) public view returns (
        string memory title,
        string memory description,
        uint8 maxParticipants,
        uint8 currentParticipants,
        uint8 completionThreshold,
        uint8 completedParticipants,
        bool isActive,
        bool isCompleted,
        bool rewardsRevealed,
        address organizer,
        uint256 startTime,
        uint256 endTime,
        uint256 revealTime
    ) {
        Quest storage quest = quests[questId];
        return (
            quest.title,
            quest.description,
            0, // FHE.decrypt(quest.maxParticipants) - will be decrypted off-chain
            0, // FHE.decrypt(quest.currentParticipants) - will be decrypted off-chain
            0, // FHE.decrypt(quest.completionThreshold) - will be decrypted off-chain
            0, // FHE.decrypt(quest.completedParticipants) - will be decrypted off-chain
            quest.isActive,
            quest.isCompleted,
            quest.rewardsRevealed,
            quest.organizer,
            quest.startTime,
            quest.endTime,
            quest.revealTime
        );
    }
    
    function getParticipantInfo(uint256 questId, address participant) public view returns (
        bool hasJoined,
        bool hasCompleted,
        uint8 contribution,
        uint256 joinTime,
        uint256 completionTime
    ) {
        Participant storage p = participants[questId][participant];
        return (
            p.hasJoined,
            p.hasCompleted,
            0, // FHE.decrypt(p.contribution) - will be decrypted off-chain
            p.joinTime,
            p.completionTime
        );
    }
    
    function getParticipantReputation(address participant) public view returns (uint8) {
        return 0; // FHE.decrypt(participantReputation[participant]) - will be decrypted off-chain
    }
    
    function getOrganizerReputation(address organizer) public view returns (uint8) {
        return 0; // FHE.decrypt(organizerReputation[organizer]) - will be decrypted off-chain
    }
    
    function getQuestRewardCount(uint256 questId) public view returns (uint256) {
        return questRewards[questId].length;
    }
    
    function getQuestReward(uint256 questId, uint256 index) public view returns (
        uint8 amount,
        address recipient,
        bool isClaimed,
        uint256 claimTime
    ) {
        require(index < questRewards[questId].length, "Reward index out of bounds");
        Reward storage reward = questRewards[questId][index];
        return (
            0, // FHE.decrypt(reward.amount) - will be decrypted off-chain
            reward.recipient,
            reward.isClaimed,
            reward.claimTime
        );
    }
}
