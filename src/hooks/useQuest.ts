import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuestContract } from '@/hooks/useContract';
import { FHEUtils, QuestContribution } from '@/lib/fhe';

export interface Quest {
  id: number;
  title: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  completionRate: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Legendary";
  timeRemaining: string;
  isActive: boolean;
  rewardType: "Mystery" | "Sealed" | "Unlocked";
  isJoined?: boolean;
  isCompleted?: boolean;
  encryptedContribution?: any;
  rewardAmount?: number;
}

export interface QuestState {
  quests: Quest[];
  isLoading: boolean;
  error: string | null;
  joinedQuests: number[];
  completedQuests: number[];
}

export const useQuest = () => {
  const { address } = useAccount();
  const { joinQuest: contractJoinQuest } = useQuestContract();
  const [state, setState] = useState<QuestState>({
    quests: [],
    isLoading: false,
    error: null,
    joinedQuests: [],
    completedQuests: [],
  });

  // Load quests from contract
  const loadQuests = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // In a real implementation, you would load quests from the contract
      // For now, we'll use mock data
      const mockQuests: Quest[] = [
        {
          id: 1,
          title: "The Forgotten Cipher",
          description: "Decode ancient symbols hidden within mystical texts. Only the wisest adventurers will uncover the truth behind the forgotten language of the ancients.",
          participants: 7,
          maxParticipants: 10,
          completionRate: 70,
          difficulty: "Medium",
          timeRemaining: "3 days",
          isActive: true,
          rewardType: "Sealed",
        },
        {
          id: 2,
          title: "Dragon's Mathematical Riddle",
          description: "Face the legendary dragon's most challenging puzzle. Solve complex mathematical sequences that have stumped scholars for centuries.",
          participants: 12,
          maxParticipants: 12,
          completionRate: 100,
          difficulty: "Hard",
          timeRemaining: "Complete",
          isActive: false,
          rewardType: "Sealed",
        },
        {
          id: 3,
          title: "Mystic Forest Expedition",
          description: "Navigate through the enchanted forest using only ancient maps and celestial guidance. Discover hidden treasures that await the brave.",
          participants: 15,
          maxParticipants: 20,
          completionRate: 45,
          difficulty: "Easy",
          timeRemaining: "7 days",
          isActive: true,
          rewardType: "Mystery",
        },
        {
          id: 4,
          title: "The Alchemist's Challenge",
          description: "Master the art of transformation. Create legendary potions using rare ingredients found only in the most dangerous realms.",
          participants: 3,
          maxParticipants: 8,
          completionRate: 25,
          difficulty: "Legendary",
          timeRemaining: "14 days",
          isActive: true,
          rewardType: "Sealed",
        },
      ];

      setState(prev => ({
        ...prev,
        quests: mockQuests,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading quests:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load quests',
        isLoading: false,
      }));
    }
  };

  // Join a quest with encrypted contribution
  const joinQuest = async (
    questId: number,
    contribution: QuestContribution
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Join quest on contract
      const result = await contractJoinQuest(questId, contribution);
      
      if (result.success) {
        // Update local state
        setState(prev => ({
          ...prev,
          joinedQuests: [...prev.joinedQuests, questId],
          quests: prev.quests.map(quest =>
            quest.id === questId
              ? {
                  ...quest,
                  isJoined: true,
                  currentParticipants: quest.currentParticipants + 1,
                }
              : quest
          ),
          isLoading: false,
        }));
      }

      return result;
    } catch (error) {
      console.error('Error joining quest:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to join quest',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to join quest' };
    }
  };

  // Complete a quest
  const completeQuest = async (
    questId: number,
    completionData: {
      score: number;
      timeSpent: number;
    }
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Complete quest on contract
      const result = await questContract.completeQuest(questId, completionData);
      
      // Update local state
      setState(prev => ({
        ...prev,
        completedQuests: [...prev.completedQuests, questId],
        quests: prev.quests.map(quest =>
          quest.id === questId
            ? {
                ...quest,
                isCompleted: true,
                completionRate: Math.min(100, quest.completionRate + 10),
              }
            : quest
        ),
        isLoading: false,
      }));

      return { success: true, txHash: result.txHash };
    } catch (error) {
      console.error('Error completing quest:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to complete quest',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to complete quest' };
    }
  };

  // Reveal quest rewards
  const revealRewards = async (
    questId: number
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await questContract.revealRewards(questId);
      
      setState(prev => ({
        ...prev,
        quests: prev.quests.map(quest =>
          quest.id === questId
            ? { ...quest, rewardType: "Unlocked" as const }
            : quest
        ),
        isLoading: false,
      }));

      return { success: true, txHash: result.txHash };
    } catch (error) {
      console.error('Error revealing rewards:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to reveal rewards',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to reveal rewards' };
    }
  };

  // Claim reward
  const claimReward = async (
    questId: number,
    rewardAmount: number
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const result = await questContract.claimReward(questId, rewardAmount);
      
      setState(prev => ({
        ...prev,
        quests: prev.quests.map(quest =>
          quest.id === questId
            ? { ...quest, rewardAmount }
            : quest
        ),
        isLoading: false,
      }));

      return { success: true, txHash: result.txHash };
    } catch (error) {
      console.error('Error claiming reward:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to claim reward',
        isLoading: false,
      }));
      return { success: false, error: 'Failed to claim reward' };
    }
  };

  // Get quest by ID
  const getQuest = (questId: number): Quest | undefined => {
    return state.quests.find(quest => quest.id === questId);
  };

  // Check if user has joined a quest
  const hasJoinedQuest = (questId: number): boolean => {
    return state.joinedQuests.includes(questId);
  };

  // Check if user has completed a quest
  const hasCompletedQuest = (questId: number): boolean => {
    return state.completedQuests.includes(questId);
  };

  // Get user's quest statistics
  const getUserStats = () => {
    return {
      totalQuests: state.quests.length,
      joinedQuests: state.joinedQuests.length,
      completedQuests: state.completedQuests.length,
      activeQuests: state.quests.filter(quest => 
        state.joinedQuests.includes(quest.id) && !state.completedQuests.includes(quest.id)
      ).length,
    };
  };

  // Load quests on mount
  useEffect(() => {
    loadQuests();
  }, [address]);

  return {
    ...state,
    loadQuests,
    joinQuest,
    completeQuest,
    revealRewards,
    claimReward,
    getQuest,
    hasJoinedQuest,
    hasCompletedQuest,
    getUserStats,
  };
};
