import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Unlock, 
  Gift, 
  Sparkles, 
  Crown,
  Coins,
  Star,
  Eye,
  EyeOff 
} from "lucide-react";

interface SealedReward {
  id: string;
  questTitle: string;
  status: "sealed" | "ready" | "revealed";
  rewardType: "Treasure" | "Artifact" | "Crown" | "Coins";
  participants: number;
  completedParticipants: number;
  estimatedValue: string;
}

const SealedRewardSystem = () => {
  const [rewards] = useState<SealedReward[]>([
    {
      id: "1",
      questTitle: "The Dragon's Riddle",
      status: "revealed",
      rewardType: "Crown",
      participants: 12,
      completedParticipants: 12,
      estimatedValue: "500 GOLD"
    },
    {
      id: "2", 
      questTitle: "Ancient Library Mystery",
      status: "ready",
      rewardType: "Artifact",
      participants: 8,
      completedParticipants: 8,
      estimatedValue: "????"
    },
    {
      id: "3",
      questTitle: "Mystic Forest Challenge",
      status: "sealed",
      rewardType: "Treasure",
      participants: 15,
      completedParticipants: 11,
      estimatedValue: "????"
    }
  ]);

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "Crown": return Crown;
      case "Artifact": return Sparkles;
      case "Treasure": return Gift;
      case "Coins": return Coins;
      default: return Star;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sealed": return "bg-muted text-muted-foreground";
      case "ready": return "bg-treasure text-primary-foreground";
      case "revealed": return "bg-quest text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="font-adventure font-bold text-4xl text-foreground mb-4">
          Sealed Reward Vault
        </h2>
        <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
          Your quest rewards await revelation. Sealed treasures can only be unlocked 
          when all adventurers complete their challenges.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rewards.map((reward) => {
          const RewardIcon = getRewardIcon(reward.rewardType);
          
          return (
            <Card key={reward.id} className="p-6 bg-gradient-parchment border-2 border-bronze shadow-ancient hover:shadow-treasure transition-all duration-300">
              {/* Reward Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full shadow-seal ${
                    reward.status === "revealed" ? "bg-gradient-gold" :
                    reward.status === "ready" ? "bg-gradient-mystical" : 
                    "bg-gradient-to-r from-muted to-secondary"
                  }`}>
                    {reward.status === "sealed" ? (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    ) : reward.status === "ready" ? (
                      <EyeOff className="w-5 h-5 text-white" />
                    ) : (
                      <RewardIcon className="w-5 h-5 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <Badge className={getStatusColor(reward.status)}>
                      {reward.status === "sealed" ? "🔒 Sealed" :
                       reward.status === "ready" ? "🎯 Ready" : 
                       "✨ Revealed"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quest Title */}
              <h3 className="font-adventure font-semibold text-lg text-foreground mb-2">
                {reward.questTitle}
              </h3>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-serif">Completion</span>
                  <span className="font-medium">
                    {reward.completedParticipants}/{reward.participants}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      reward.status === "revealed" ? "bg-quest" :
                      reward.status === "ready" ? "bg-treasure" :
                      "bg-muted"
                    }`}
                    style={{ 
                      width: `${(reward.completedParticipants / reward.participants) * 100}%` 
                    }}
                  />
                </div>
              </div>

              {/* Reward Value */}
              <div className="mb-6">
                <div className="text-center p-4 bg-card/50 rounded-lg border border-bronze">
                  {reward.status === "revealed" ? (
                    <div>
                      <div className="text-2xl font-adventure font-bold text-treasure mb-1">
                        {reward.estimatedValue}
                      </div>
                      <div className="text-xs text-muted-foreground font-serif">
                        {reward.rewardType} Revealed
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl font-adventure font-bold text-muted-foreground mb-1">
                        {reward.estimatedValue}
                      </div>
                      <div className="text-xs text-muted-foreground font-serif">
                        {reward.rewardType} Hidden
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                disabled={reward.status === "sealed"}
                className={`w-full font-adventure font-medium ${
                  reward.status === "revealed" ? 
                    "bg-quest hover:bg-quest/90 text-white" :
                  reward.status === "ready" ?
                    "bg-gradient-mystical hover:bg-gradient-mystical/90 text-white" :
                    "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {reward.status === "sealed" && (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Awaiting Completion
                  </>
                )}
                {reward.status === "ready" && (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Reveal Reward
                  </>
                )}
                {reward.status === "revealed" && (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Claim Reward
                  </>
                )}
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default SealedRewardSystem;