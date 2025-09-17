import { Contract, parseEther, formatEther } from 'viem';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { FHEUtils, QuestContribution, QuestReward } from './fhe';

// Contract ABI - This would be generated from your compiled contract
const QUEST_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string", 
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_maxParticipants",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_duration",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "rewardPool",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "completionThreshold",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "createQuest",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "contribution",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "joinQuest",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "completionProof",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "completeQuest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "revealRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "rewardAmount",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "getQuestInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "maxParticipants",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "currentParticipants",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "completionThreshold",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "completedParticipants",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "rewardsRevealed",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "organizer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "revealTime",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address - This should be set after deployment
const QUEST_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_QUEST_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export class QuestContract {
  private contractAddress: string;
  private abi: typeof QUEST_CONTRACT_ABI;

  constructor(contractAddress?: string) {
    this.contractAddress = contractAddress || QUEST_CONTRACT_ADDRESS;
    this.abi = QUEST_CONTRACT_ABI;
  }

  // Create a new quest with encrypted reward pool
  async createQuest(
    title: string,
    description: string,
    maxParticipants: number,
    duration: number,
    rewardPool: QuestReward
  ): Promise<{
    questId: number;
    txHash: string;
  }> {
    try {
      // Encrypt reward pool data
      const { encryptedReward, proof } = await FHEUtils.encryptQuestReward(rewardPool);
      
      // Convert encrypted data to bytes for contract
      const rewardPoolBytes = this.encodeEncryptedData(encryptedReward);
      const completionThresholdBytes = this.encodeEncryptedData(
        await FHEUtils.encryptValue(maxParticipants)
      );
      const inputProofBytes = this.encodeProof(proof);

      // Call contract function
      const { writeContract } = useWriteContract();
      
      const txHash = await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'createQuest',
        args: [
          title,
          description,
          BigInt(maxParticipants),
          BigInt(duration),
          rewardPoolBytes,
          completionThresholdBytes,
          inputProofBytes
        ],
      });

      // Wait for transaction confirmation
      const { data: receipt } = useWaitForTransactionReceipt({
        hash: txHash,
      });

      // Extract quest ID from transaction logs
      const questId = this.extractQuestIdFromReceipt(receipt);

      return { questId, txHash };
    } catch (error) {
      console.error('Error creating quest:', error);
      throw new Error('Failed to create quest');
    }
  }

  // Join a quest with encrypted contribution
  async joinQuest(
    questId: number,
    contribution: QuestContribution
  ): Promise<{
    participantId: number;
    txHash: string;
  }> {
    try {
      // Encrypt contribution data
      const { encryptedContribution, proof } = await FHEUtils.encryptQuestContribution({
        amount: contribution.amount,
        difficulty: contribution.difficulty,
        timeSpent: contribution.timeSpent,
      });

      // Convert to bytes
      const contributionBytes = this.encodeEncryptedData(encryptedContribution);
      const inputProofBytes = this.encodeProof(proof);

      const { writeContract } = useWriteContract();
      
      const txHash = await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'joinQuest',
        args: [
          BigInt(questId),
          contributionBytes,
          inputProofBytes
        ],
      });

      const { data: receipt } = useWaitForTransactionReceipt({
        hash: txHash,
      });

      const participantId = this.extractParticipantIdFromReceipt(receipt);

      return { participantId, txHash };
    } catch (error) {
      console.error('Error joining quest:', error);
      throw new Error('Failed to join quest');
    }
  }

  // Complete a quest
  async completeQuest(
    questId: number,
    completionData: {
      score: number;
      timeSpent: number;
    }
  ): Promise<{
    txHash: string;
  }> {
    try {
      // Calculate and encrypt quest score
      const { encryptedScore, proof } = await FHEUtils.calculateQuestScore(
        completionData.score,
        1, // difficulty multiplier
        completionData.timeSpent
      );

      const completionProofBytes = this.encodeEncryptedData(encryptedScore);
      const inputProofBytes = this.encodeProof(proof);

      const { writeContract } = useWriteContract();
      
      const txHash = await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'completeQuest',
        args: [
          BigInt(questId),
          completionProofBytes,
          inputProofBytes
        ],
      });

      return { txHash };
    } catch (error) {
      console.error('Error completing quest:', error);
      throw new Error('Failed to complete quest');
    }
  }

  // Reveal quest rewards
  async revealRewards(questId: number): Promise<{
    txHash: string;
  }> {
    try {
      const { writeContract } = useWriteContract();
      
      const txHash = await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'revealRewards',
        args: [BigInt(questId)],
      });

      return { txHash };
    } catch (error) {
      console.error('Error revealing rewards:', error);
      throw new Error('Failed to reveal rewards');
    }
  }

  // Claim reward
  async claimReward(
    questId: number,
    rewardAmount: number
  ): Promise<{
    txHash: string;
  }> {
    try {
      const { encryptedReward, proof } = await FHEUtils.encryptValue(rewardAmount);
      
      const rewardAmountBytes = this.encodeEncryptedData(encryptedReward);
      const inputProofBytes = this.encodeProof(proof);

      const { writeContract } = useWriteContract();
      
      const txHash = await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'claimReward',
        args: [
          BigInt(questId),
          rewardAmountBytes,
          inputProofBytes
        ],
      });

      return { txHash };
    } catch (error) {
      console.error('Error claiming reward:', error);
      throw new Error('Failed to claim reward');
    }
  }

  // Get quest information
  async getQuestInfo(questId: number) {
    try {
      const { data } = useReadContract({
        address: this.contractAddress as `0x${string}`,
        abi: this.abi,
        functionName: 'getQuestInfo',
        args: [BigInt(questId)],
      });

      return data;
    } catch (error) {
      console.error('Error getting quest info:', error);
      throw new Error('Failed to get quest info');
    }
  }

  // Helper functions
  private encodeEncryptedData(data: any): `0x${string}` {
    // Convert encrypted data to hex string
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(jsonString);
    return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
  }

  private encodeProof(proof: string): `0x${string}` {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(proof);
    return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
  }

  private extractQuestIdFromReceipt(receipt: any): number {
    // Extract quest ID from transaction logs
    // This would depend on your contract's event structure
    return 1; // Placeholder
  }

  private extractParticipantIdFromReceipt(receipt: any): number {
    // Extract participant ID from transaction logs
    return 1; // Placeholder
  }
}

// Export contract instance
export const questContract = new QuestContract();
