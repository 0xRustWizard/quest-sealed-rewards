import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Key,
  Sparkles
} from "lucide-react";
import { useAccount } from 'wagmi';
import { questContract } from '@/lib/contract';
import { FHEUtils, QuestContribution } from '@/lib/fhe';
import { useToast } from "@/hooks/use-toast";

interface JoinQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: {
    id: number;
    title: string;
    description: string;
    maxParticipants: number;
    currentParticipants: number;
    difficulty: string;
    timeRemaining: string;
  };
}

interface QuestFormData {
  contribution: number;
  estimatedTime: number;
  commitment: string;
}

const JoinQuestModal = ({ isOpen, onClose, quest }: JoinQuestModalProps) => {
  const { address } = useAccount();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<QuestFormData>({
    contribution: 0,
    estimatedTime: 0,
    commitment: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [showEncryptionDetails, setShowEncryptionDetails] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = [
    { id: 1, title: "Quest Details", description: "Review quest information" },
    { id: 2, title: "Contribution", description: "Set your contribution" },
    { id: 3, title: "Encryption", description: "Encrypt your data" },
    { id: 4, title: "Confirmation", description: "Confirm and join" },
  ];

  const difficultyMultipliers = {
    Easy: 1,
    Medium: 1.5,
    Hard: 2,
    Legendary: 3,
  };

  const handleInputChange = (field: keyof QuestFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const simulateEncryption = async () => {
    setEncryptionProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      setEncryptionProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const handleJoinQuest = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to join the quest.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setStep(3);

    try {
      // Step 1: Simulate encryption process
      await simulateEncryption();
      
      // Step 2: Prepare contribution data
      const contribution: QuestContribution = {
        amount: formData.contribution,
        difficulty: difficultyMultipliers[quest.difficulty as keyof typeof difficultyMultipliers],
        timeSpent: formData.estimatedTime,
        questId: quest.id.toString(),
        participantAddress: address,
      };

      // Step 3: Join quest with encrypted data
      const result = await questContract.joinQuest(quest.id, contribution);
      
      setTxHash(result.txHash);
      setStep(4);
      setIsSuccess(true);
      
      toast({
        title: "🎉 Quest Joined Successfully!",
        description: "Your encrypted contribution has been recorded on-chain.",
      });

    } catch (error) {
      console.error('Error joining quest:', error);
      toast({
        title: "Failed to Join Quest",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setStep(1);
      setFormData({
        contribution: 0,
        estimatedTime: 0,
        commitment: '',
      });
      setEncryptionProgress(0);
      setTxHash('');
      setIsSuccess(false);
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <Card className="p-4 bg-gradient-parchment border-2 border-bronze">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-gold rounded-lg">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-adventure font-semibold text-lg">{quest.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Participants:</span>
                  <span className="ml-2 font-medium">{quest.currentParticipants}/{quest.maxParticipants}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Difficulty:</span>
                  <Badge className="ml-2 bg-quest text-white">{quest.difficulty}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Time Remaining:</span>
                  <span className="ml-2 font-medium">{quest.timeRemaining}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 text-quest font-medium">Active</span>
                </div>
              </div>
            </Card>

            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Your contribution will be encrypted using FHE technology
              </span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="contribution" className="text-sm font-medium">
                  Contribution Amount (ETH)
                </Label>
                <Input
                  id="contribution"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.contribution}
                  onChange={(e) => handleInputChange('contribution', parseFloat(e.target.value) || 0)}
                  placeholder="0.001"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be encrypted and used for reward calculation
                </p>
              </div>

              <div>
                <Label htmlFor="estimatedTime" className="text-sm font-medium">
                  Estimated Time (hours)
                </Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  min="1"
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 0)}
                  placeholder="24"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How long you expect to spend on this quest
                </p>
              </div>

              <div>
                <Label htmlFor="commitment" className="text-sm font-medium">
                  Quest Commitment
                </Label>
                <Input
                  id="commitment"
                  value={formData.commitment}
                  onChange={(e) => handleInputChange('commitment', e.target.value)}
                  placeholder="I commit to completing this quest..."
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your public commitment to the quest
                </p>
              </div>
            </div>

            <Card className="p-4 bg-gradient-seal border-2 border-mystical">
              <div className="flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-mystical" />
                <span className="font-adventure font-medium text-mystical">Encryption Preview</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Contribution: {formData.contribution} ETH → 🔒 Encrypted</div>
                <div>Time: {formData.estimatedTime}h → 🔒 Encrypted</div>
                <div>Difficulty: {quest.difficulty} → 🔒 Encrypted</div>
              </div>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="p-4 bg-gradient-gold rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground animate-pulse" />
              </div>
              <h3 className="font-adventure font-semibold text-lg mb-2">Encrypting Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Your contribution is being encrypted using FHE technology
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Encryption Progress</span>
                  <span>{encryptionProgress}%</span>
                </div>
                <Progress value={encryptionProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-green-50 border border-green-200 rounded text-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <div>Data Validation</div>
                </div>
                <div className={`p-2 border rounded text-center ${
                  encryptionProgress > 30 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <Shield className={`w-4 h-4 mx-auto mb-1 ${
                    encryptionProgress > 30 ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div>FHE Encryption</div>
                </div>
                <div className={`p-2 border rounded text-center ${
                  encryptionProgress > 70 ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <Lock className={`w-4 h-4 mx-auto mb-1 ${
                    encryptionProgress > 70 ? 'text-purple-600' : 'text-gray-400'
                  }`} />
                  <div>Proof Generation</div>
                </div>
              </div>
            </div>

            {showEncryptionDetails && (
              <Card className="p-4 bg-gray-50 border">
                <div className="text-xs space-y-2">
                  <div className="font-mono">
                    <div>Contribution: 0x{formData.contribution.toString(16).padStart(8, '0')}...</div>
                    <div>Time: 0x{formData.estimatedTime.toString(16).padStart(8, '0')}...</div>
                    <div>Difficulty: 0x{difficultyMultipliers[quest.difficulty as keyof typeof difficultyMultipliers].toString(16).padStart(8, '0')}...</div>
                  </div>
                </div>
              </Card>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEncryptionDetails(!showEncryptionDetails)}
              className="w-full"
            >
              {showEncryptionDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showEncryptionDetails ? 'Hide' : 'Show'} Encryption Details
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            {isSuccess ? (
              <>
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-adventure font-semibold text-lg mb-2 text-green-800">
                    Quest Joined Successfully!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your encrypted contribution has been recorded on the blockchain
                  </p>
                </div>

                <Card className="p-4 bg-gradient-parchment border-2 border-bronze">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Transaction Hash:</span>
                      <span className="font-mono text-xs">{txHash.slice(0, 10)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quest ID:</span>
                      <span className="font-medium">{quest.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                    </div>
                  </div>
                </Card>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    🔒 Your contribution is now encrypted and stored on-chain. 
                    Rewards will be revealed when all participants complete the quest.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-adventure font-semibold text-lg mb-2 text-red-800">
                    Failed to Join Quest
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    There was an error processing your request
                  </p>
                </div>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-adventure text-xl">
            Join Quest: {quest.title}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((stepItem, index) => (
            <div key={stepItem.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepItem.id 
                  ? 'bg-gradient-gold text-primary-foreground' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step > stepItem.id ? <CheckCircle className="w-4 h-4" /> : stepItem.id}
              </div>
              <div className="ml-2 hidden sm:block">
                <div className="text-xs font-medium">{stepItem.title}</div>
                <div className="text-xs text-muted-foreground">{stepItem.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  step > stepItem.id ? 'bg-gradient-gold' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          {step < 4 && (
            <Button
              onClick={step === 1 ? () => setStep(2) : step === 2 ? handleJoinQuest : undefined}
              disabled={isLoading || (step === 2 && (!formData.contribution || !formData.estimatedTime))}
              className="bg-gradient-gold hover:bg-gradient-gold/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : step === 1 ? (
                'Continue'
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Join Quest
                </>
              )}
            </Button>
          )}
          
          {step === 4 && (
            <Button
              onClick={handleClose}
              className="bg-gradient-gold hover:bg-gradient-gold/90 text-primary-foreground"
            >
              Complete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinQuestModal;
