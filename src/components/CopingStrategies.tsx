import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lightbulb, Heart } from "lucide-react";
import { useState } from "react";

interface CopingStrategiesProps {
  strategies: string[];
  onStrategyTried?: (strategy: string) => void;
}

const CopingStrategies = ({ strategies, onStrategyTried }: CopingStrategiesProps) => {
  const [triedStrategies, setTriedStrategies] = useState<Set<string>>(new Set());

  const handleStrategyTried = (strategy: string) => {
    setTriedStrategies(prev => new Set([...prev, strategy]));
    onStrategyTried?.(strategy);
  };

  if (!strategies || strategies.length === 0) return null;

  return (
    <Card className="p-4 bg-card border-border/50">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Personalized Coping Strategies</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Based on our conversation, here are some strategies that might help:
        </p>

        <div className="space-y-3">
          {strategies.map((strategy, index) => {
            const isTried = triedStrategies.has(strategy);
            
            return (
              <div 
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  isTried 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-muted/50 hover:bg-muted/70'
                }`}
              >
                <div className="flex-1">
                  <p className={`text-sm ${isTried ? 'text-green-800' : 'text-foreground'}`}>
                    {strategy}
                  </p>
                </div>
                
                <Button
                  onClick={() => handleStrategyTried(strategy)}
                  variant={isTried ? "default" : "outline"}
                  size="sm"
                  className={`min-w-fit ${
                    isTried 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'border-primary/30 hover:bg-primary-soft'
                  }`}
                  disabled={isTried}
                >
                  {isTried ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Tried
                    </>
                  ) : (
                    <>
                      <Heart className="w-3 h-3 mr-1" />
                      Try This
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>

        {triedStrategies.size > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              Great job trying {triedStrategies.size} strateg{triedStrategies.size === 1 ? 'y' : 'ies'}! 
              How are you feeling after trying these approaches?
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CopingStrategies;