import { useToast } from "@/hooks/use-toast";
import HeroSection from "@/components/HeroSection";
import WalletConnection from "@/components/WalletConnection";
import QuestCard from "@/components/QuestCard";
import SealedRewardSystem from "@/components/SealedRewardSystem";

const Index = () => {
  const { toast } = useToast();

  const handleJoinQuest = () => {
    toast({
      title: "⚔️ Quest Joined!",
      description: "Your adventure begins. Complete the challenge to unlock sealed rewards.",
    });
  };

  const mockQuests = [
    {
      title: "The Forgotten Cipher",
      description: "Decode ancient symbols hidden within mystical texts. Only the wisest adventurers will uncover the truth behind the forgotten language of the ancients.",
      participants: 7,
      maxParticipants: 10,
      completionRate: 70,
      difficulty: "Medium" as const,
      timeRemaining: "3 days",
      isActive: true,
      rewardType: "Sealed" as const
    },
    {
      title: "Dragon's Mathematical Riddle", 
      description: "Face the legendary dragon's most challenging puzzle. Solve complex mathematical sequences that have stumped scholars for centuries.",
      participants: 12,
      maxParticipants: 12,
      completionRate: 100,
      difficulty: "Hard" as const,
      timeRemaining: "Complete",
      isActive: false,
      rewardType: "Sealed" as const
    },
    {
      title: "Mystic Forest Expedition",
      description: "Navigate through the enchanted forest using only ancient maps and celestial guidance. Discover hidden treasures that await the brave.",
      participants: 15,
      maxParticipants: 20,
      completionRate: 45,
      difficulty: "Easy" as const,
      timeRemaining: "7 days",
      isActive: true,
      rewardType: "Mystery" as const
    },
    {
      title: "The Alchemist's Challenge",
      description: "Master the art of transformation. Create legendary potions using rare ingredients found only in the most dangerous realms.",
      participants: 3,
      maxParticipants: 8,
      completionRate: 25,
      difficulty: "Legendary" as const,
      timeRemaining: "14 days",
      isActive: true,
      rewardType: "Sealed" as const
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Wallet Connection */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <WalletConnection />
      </section>

      {/* Active Quests */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-adventure font-bold text-4xl text-foreground mb-4">
            Active Adventures
          </h2>
          <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your quest wisely. Each adventure holds encrypted rewards that will be 
            revealed only when all brave souls complete their challenges.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockQuests.map((quest, index) => (
            <QuestCard
              key={index}
              title={quest.title}
              description={quest.description}
              participants={quest.participants}
              maxParticipants={quest.maxParticipants}
              completionRate={quest.completionRate}
              difficulty={quest.difficulty}
              timeRemaining={quest.timeRemaining}
              isActive={quest.isActive}
              rewardType={quest.rewardType}
              onJoinQuest={handleJoinQuest}
            />
          ))}
        </div>
      </section>

      {/* Sealed Rewards */}
      <SealedRewardSystem />

      {/* Footer */}
      <footer className="bg-gradient-parchment border-t-2 border-bronze py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="font-adventure font-semibold text-2xl text-foreground mb-4">
            Begin Your Encrypted Adventure
          </h3>
          <p className="font-serif text-muted-foreground max-w-2xl mx-auto">
            Join thousands of adventurers in the most fair and secure quest reward system ever created. 
            Your treasures await, sealed until victory is shared by all.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Index;