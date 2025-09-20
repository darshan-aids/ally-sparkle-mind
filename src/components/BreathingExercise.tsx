import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface BreathingExerciseProps {
  exercise: {
    name: string;
    duration: number;
    instructions: string[];
  };
  onComplete?: () => void;
}

const BreathingExercise = ({ exercise, onComplete }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration);
  const [breathPhase, setBreathPhase] = useState(0); // 0: inhale, 1: hold, 2: exhale
  
  const phases = ["Breathe In", "Hold", "Breathe Out"];
  const phaseDurations = [4, 4, 8]; // seconds for 4-7-8 breathing (can be customized)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return time - 1;
        });
        
        // Cycle through breathing phases
        setBreathPhase(phase => (phase + 1) % 3);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, onComplete]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(exercise.duration);
    setCurrentStep(0);
    setBreathPhase(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-6 bg-comfort-gradient border-primary/20">
      <div className="text-center space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {exercise.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Let's take a moment to breathe together
          </p>
        </div>

        {/* Breathing Circle Animation */}
        <div className="relative mx-auto">
          <div 
            className={`w-32 h-32 rounded-full border-4 border-primary transition-all duration-1000 flex items-center justify-center ${
              isActive 
                ? breathPhase === 0 
                  ? 'scale-110 border-green-400 bg-green-50' 
                  : breathPhase === 1
                    ? 'scale-100 border-yellow-400 bg-yellow-50'
                    : 'scale-90 border-blue-400 bg-blue-50'
                : 'scale-100 bg-primary-soft'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatTime(timeRemaining)}
              </div>
              {isActive && (
                <div className="text-sm text-muted-foreground mt-1">
                  {phases[breathPhase]}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          {exercise.instructions.map((instruction, index) => (
            <p 
              key={index}
              className={`text-sm transition-colors ${
                currentStep === index && isActive 
                  ? 'text-primary font-medium' 
                  : 'text-muted-foreground'
              }`}
            >
              {index + 1}. {instruction}
            </p>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="bg-wellness-gradient hover:shadow-gentle-glow transition-gentle"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Exercise
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              className="border-primary/30 hover:bg-primary-soft"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button
            onClick={handleReset}
            variant="outline"
            size="icon"
            className="border-primary/30 hover:bg-primary-soft"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {timeRemaining === 0 && (
          <div className="text-center space-y-2">
            <p className="text-green-600 font-medium">Exercise Complete! 🌟</p>
            <p className="text-sm text-muted-foreground">
              How are you feeling now?
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BreathingExercise;