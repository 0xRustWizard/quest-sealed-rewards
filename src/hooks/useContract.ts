import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { FHEUtils } from '@/lib/fhe';
import { QuestContribution, QuestReward } from '@/lib/fhe';

export const useQuestContract = () => {
  const { writeContract, isPending, error } = useWriteContract();

  // Contract address and ABI
  const contractAddress = process.env.NEXT_PUBLIC_QUEST_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
  const contractABI = [
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
    }
  ] as const;

  // Helper function to encode encrypted data
  const encodeEncryptedData = (data: any): `0x${string}` => {
    const jsonString = JSON.stringify(data);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(jsonString);
    return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
  };

  // Helper function to encode proof
  const encodeProof = (proof: string): `0x${string}` => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(proof);
    return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`;
  };

  // Join quest with encrypted contribution
  const joinQuest = async (
    questId: number,
    contribution: QuestContribution
  ): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    try {
      // Encrypt contribution data
      const { encryptedContribution, proof } = await FHEUtils.encryptQuestContribution({
        amount: contribution.amount,
        difficulty: contribution.difficulty,
        timeSpent: contribution.timeSpent,
      });

      // Convert to bytes
      const contributionBytes = encodeEncryptedData(encryptedContribution);
      const inputProofBytes = encodeProof(proof);

      const txHash = await writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'joinQuest',
        args: [
          BigInt(questId),
          contributionBytes,
          inputProofBytes
        ],
      });

      return { success: true, txHash };
    } catch (error) {
      console.error('Error joining quest:', error);
      return { success: false, error: 'Failed to join quest' };
    }
  };

  return {
    joinQuest,
    isPending,
    error,
  };
};
