import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, BookOpen, Users, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-parchment opacity-50"></div>
      
      <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
        {/* Hero Badge */}
        <Badge className="mb-6 bg-gradient-mystical text-white px-4 py-2 text-sm font-adventure">
          <Shield className="w-4 h-4 mr-2" />
          Encrypted Quest System
        </Badge>

        {/* Main Heading */}
        <h1 className="font-adventure font-bold text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
          Complete Quests,
          <span className="block text-transparent bg-gradient-gold bg-clip-text">
            Reveal Rewards Later
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-serif text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          Embark on encrypted adventures where rewards remain sealed until all participants 
          complete their quests. Fair distribution guaranteed, exploitation impossible.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-bronze shadow-ancient hover:shadow-treasure transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-seal rounded-full flex items-center justify-center mx-auto mb-4 shadow-seal">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-adventure font-semibold text-lg mb-2 text-foreground">
              Sealed Adventures
            </h3>
            <p className="text-sm text-muted-foreground font-serif">
              Quest rewards remain encrypted until all adventurers complete their challenges
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-bronze shadow-ancient hover:shadow-treasure transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-treasure">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-adventure font-semibold text-lg mb-2 text-foreground">
              Fair Distribution
            </h3>
            <p className="text-sm text-muted-foreground font-serif">
              No early advantage - everyone discovers their rewards simultaneously
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-bronze shadow-ancient hover:shadow-treasure transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-mystical rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-adventure font-semibold text-lg mb-2 text-foreground">
              Wallet Required
            </h3>
            <p className="text-sm text-muted-foreground font-serif">
              Connect your digital vault to participate in encrypted quest rewards
            </p>
          </Card>
        </div>

        {/* Adventure Stats */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-center">
          <div>
            <div className="text-3xl font-adventure font-bold text-treasure">127</div>
            <div className="text-sm text-muted-foreground font-serif">Active Quests</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-border"></div>
          <div>
            <div className="text-3xl font-adventure font-bold text-mystical">2,847</div>
            <div className="text-sm text-muted-foreground font-serif">Brave Adventurers</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-border"></div>
          <div>
            <div className="text-3xl font-adventure font-bold text-sealed">956</div>
            <div className="text-sm text-muted-foreground font-serif">Sealed Rewards</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;