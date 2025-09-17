import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Scroll, 
  Users, 
  Clock, 
  Star, 
  Lock,
  CheckCircle,
  Zap
} from "lucide-react";

interface QuestCardProps {
  title: string;
  description: string;
  participants: number;
  maxParticipants: number;
  completionRate: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Legendary";
  timeRemaining: string;
  isActive: boolean;
  rewardType: "Mystery" | "Sealed" | "Unlocked";
  onJoinQuest: () => void;
}

const QuestCard = ({
  title,
  description,
  participants,
  maxParticipants,
  completionRate,
  difficulty,
  timeRemaining,
  isActive,
  rewardType,
  onJoinQuest
}: QuestCardProps) => {
  const [isJoined, setIsJoined] = useState(false);

  const difficultyColors = {
    Easy: "bg-quest text-white",
    Medium: "bg-treasure text-primary-foreground",
    Hard: "bg-sealed text-white",
    Legendary: "bg-gradient-mystical text-white"
  };

  const handleJoinQuest = () => {
    setIsJoined(true);
    onJoinQuest();
  };

  return (
    <Card className="p-6 bg-gradient-parchment border-2 border-bronze shadow-ancient hover:shadow-treasure transition-all duration-300 group">
      {/* Quest Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-gold rounded-lg shadow-seal">
            <Scroll className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-adventure font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={difficultyColors[difficulty]}>
                {difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {timeRemaining}
              </div>
            </div>
          </div>
        </div>
        
        {rewardType === "Sealed" && (
          <div className="p-2 bg-gradient-seal rounded-full shadow-seal">
            <Lock className="w-4 h-4 text-accent-foreground" />
          </div>
        )}
      </div>

      {/* Quest Description */}
      <p className="text-sm text-muted-foreground font-serif mb-4 leading-relaxed">
        {description}
      </p>

      {/* Progress Section */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {participants}/{maxParticipants} Adventurers
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-quest">
            <Star className="w-4 h-4" />
            <span className="font-medium">{completionRate}% Complete</span>
          </div>
        </div>
        
        <Progress 
          value={completionRate} 
          className="h-2 bg-secondary"
        />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Quest Progress</span>
          {completionRate === 100 && (
            <div className="flex items-center gap-1 text-quest">
              <CheckCircle className="w-3 h-3" />
              Ready for Reward Reveal
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        {!isJoined ? (
          <Button 
            onClick={handleJoinQuest}
            disabled={!isActive || participants >= maxParticipants}
            className="flex-1 bg-gradient-gold hover:bg-gradient-gold/90 text-primary-foreground font-adventure font-medium shadow-treasure"
          >
            <Zap className="w-4 h-4 mr-2" />
            Join Quest
          </Button>
        ) : (
          <Button 
            variant="outline"
            className="flex-1 border-quest text-quest hover:bg-quest/10"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Quest Joined
          </Button>
        )}
        
        <div className="ml-3 text-center">
          <div className="text-xs text-muted-foreground">Sealed Reward</div>
          <div className="text-sm font-adventure font-semibold text-mystical">
            {rewardType === "Sealed" ? "🔒 Hidden" : "🎁 Mystery"}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuestCard;