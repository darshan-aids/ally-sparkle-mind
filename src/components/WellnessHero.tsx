import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Heart, MessageCircle } from "lucide-react";
import heroImage from "@/assets/hero-wellness.jpg";

const WellnessHero = () => {
  return (
    <div className="min-h-screen bg-comfort-gradient">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">MindfulSpace</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>100% Anonymous</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight text-foreground">
                A safe space to
                <span className="bg-wellness-gradient bg-clip-text text-transparent"> talk, learn, and grow</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your anonymous AI companion for mental wellness. No judgments, no records, 
                just genuine support when you need it most.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-wellness-gradient hover:shadow-gentle-glow transition-gentle text-white px-8 py-6 text-lg rounded-full">
                Start Chatting Now
                <MessageCircle className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-full border-primary/20 hover:bg-primary-soft transition-gentle">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Private & Secure</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Empathetic AI</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">24/7 Available</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-0 overflow-hidden shadow-soft border-0">
              <img 
                src={heroImage} 
                alt="Peaceful illustration representing mental wellness and calm"
                className="w-full h-auto rounded-lg"
              />
            </Card>
          </div>
        </div>
      </main>

      {/* Quick Access Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h3 className="text-3xl font-bold text-foreground mb-8">
            How can I help you today?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <QuickAccessCard 
              title="Feeling Stressed"
              description="Let's talk through what's weighing on your mind"
              emoji="😰"
            />
            <QuickAccessCard 
              title="Need Study Tips"
              description="Get personalized strategies for better focus"
              emoji="📚"
            />
            <QuickAccessCard 
              title="Just Want to Chat"
              description="Sometimes you just need someone to listen"
              emoji="💭"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const QuickAccessCard = ({ title, description, emoji }: { title: string; description: string; emoji: string }) => {
  return (
    <Card className="p-6 hover:shadow-soft transition-gentle cursor-pointer group border-border/50 hover:border-primary/30">
      <div className="text-center space-y-4">
        <div className="text-4xl">{emoji}</div>
        <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-gentle">
          {title}
        </h4>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </div>
    </Card>
  );
};

export default WellnessHero;