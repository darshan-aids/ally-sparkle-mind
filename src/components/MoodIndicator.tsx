import { Card } from "@/components/ui/card";
import { MoodAnalysis } from "@/lib/gemini";
import { Heart, Brain, Zap, CloudRain, Sun, AlertTriangle } from "lucide-react";

interface MoodIndicatorProps {
  mood: MoodAnalysis;
  className?: string;
}

const MoodIndicator = ({ mood, className = "" }: MoodIndicatorProps) => {
  const getMoodIcon = (emotion: string, intensity: number) => {
    const size = Math.max(16, Math.min(24, 16 + intensity));
    
    switch (emotion.toLowerCase()) {
      case 'anxious':
      case 'stressed':
        return <Zap className={`w-${size/4} h-${size/4} text-yellow-500`} />;
      case 'sad':
      case 'depressed':
        return <CloudRain className={`w-${size/4} h-${size/4} text-blue-400`} />;
      case 'angry':
      case 'frustrated':
        return <AlertTriangle className={`w-${size/4} h-${size/4} text-red-400`} />;
      case 'hopeful':
      case 'happy':
        return <Sun className={`w-${size/4} h-${size/4} text-amber-400`} />;
      case 'calm':
      case 'peaceful':
        return <Heart className={`w-${size/4} h-${size/4} text-green-400`} />;
      default:
        return <Brain className={`w-${size/4} h-${size/4} text-primary`} />;
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return "bg-green-100 border-green-200";
    if (intensity <= 6) return "bg-yellow-100 border-yellow-200";
    if (intensity <= 8) return "bg-orange-100 border-orange-200";
    return "bg-red-100 border-red-200";
  };

  const getIntensityWidth = (intensity: number) => {
    return `${(intensity / 10) * 100}%`;
  };

  return (
    <Card className={`p-3 border-border/30 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {getMoodIcon(mood.primary_emotion, mood.intensity)}
          <span className="text-sm font-medium capitalize text-foreground">
            {mood.primary_emotion}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                mood.intensity <= 3 ? 'bg-green-400' :
                mood.intensity <= 6 ? 'bg-yellow-400' :
                mood.intensity <= 8 ? 'bg-orange-400' : 'bg-red-400'
              }`}
              style={{ width: getIntensityWidth(mood.intensity) }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Intensity: {mood.intensity}/10
          </p>
        </div>

        {mood.crisis_indicators.length > 0 && (
          <div className="text-red-500">
            <AlertTriangle className="w-4 h-4" />
          </div>
        )}
      </div>

      {mood.recommended_approach && (
        <p className="text-xs text-muted-foreground mt-2 italic">
          Using {mood.recommended_approach.replace(/_/g, ' ')} approach
        </p>
      )}
    </Card>
  );
};

export default MoodIndicator;