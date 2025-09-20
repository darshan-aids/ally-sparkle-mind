import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Shield, Brain, Sparkles } from "lucide-react";
import { WellnessAI, AIResponse } from "@/lib/gemini";
import MoodIndicator from "./MoodIndicator";
import BreathingExercise from "./BreathingExercise";
import CopingStrategies from "./CopingStrategies";
import CrisisResources from "./CrisisResources";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  aiResponse?: AIResponse;
}

const ChatInterface = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [wellnessAI] = useState(() => new WellnessAI());
  const [currentMood, setCurrentMood] = useState<any>(null);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load previous session if available
    const lastMood = wellnessAI.loadSession();
    if (lastMood) {
      setCurrentMood(lastMood);
    }

    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      content: "Hi there! I'm your MindfulSpace AI companion. I'm here to listen, understand, and support you through whatever you're experiencing. This conversation is completely private and anonymous - just between us. What's on your mind today?",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [wellnessAI]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const aiResponse = await wellnessAI.generateResponse(userMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.message,
        isBot: true,
        timestamp: new Date(),
        aiResponse,
      };

      setMessages(prev => [...prev, botMessage]);
      setCurrentMood(aiResponse.mood_analysis);

      // Show breathing exercise if high stress/anxiety
      if (aiResponse.mood_analysis.intensity >= 7 && 
          ['anxious', 'stressed', 'panic'].includes(aiResponse.mood_analysis.primary_emotion.toLowerCase())) {
        setShowBreathingExercise(true);
      }

      // Show crisis resources if needed
      if (aiResponse.resources?.some(r => r.urgent) || aiResponse.mood_analysis.crisis_indicators.length > 0) {
        toast({
          title: "Support Resources Available",
          description: "I've shared some important resources that might help right now.",
          variant: "default",
        });
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting right now, but I'm still here for you. Sometimes technical issues happen, but your feelings and experiences are still completely valid. Can you tell me more about what you're going through?",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Issue",
        description: "Having trouble with AI responses, but I'm still here to listen.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStrategyTried = (strategy: string) => {
    toast({
      title: "Great job! 🌟",
      description: `You tried: ${strategy}`,
      variant: "default",
    });
  };

  const handleBreathingComplete = () => {
    setShowBreathingExercise(false);
    toast({
      title: "Breathing exercise complete! 🧘‍♀️",
      description: "How are you feeling now?",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="hover:bg-primary-soft transition-gentle"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-wellness-gradient rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground flex items-center gap-1">
                  MindfulSpace AI
                  <Sparkles className="w-3 h-3 text-primary" />
                </h1>
                <p className="text-xs text-muted-foreground">Empathetic AI Companion</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary-soft px-3 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Anonymous & Private</span>
          </div>
        </div>
      </header>

      {/* Mood Indicator */}
      {currentMood && (
        <div className="container mx-auto max-w-4xl p-4">
          <MoodIndicator mood={currentMood} />
        </div>
      )}

      {/* Breathing Exercise Modal */}
      {showBreathingExercise && messages.find(m => m.aiResponse?.breathing_exercise) && (
        <div className="container mx-auto max-w-4xl p-4">
          <BreathingExercise 
            exercise={messages.find(m => m.aiResponse?.breathing_exercise)!.aiResponse!.breathing_exercise!}
            onComplete={handleBreathingComplete}
          />
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto max-w-4xl p-4">
        <ScrollArea className="h-[calc(100vh-300px)]" ref={scrollAreaRef}>
          <div className="space-y-6 pb-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-4">
                <div className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-xs lg:max-w-md ${message.isBot ? "" : "ml-auto"}`}>
                    <Card
                      className={`p-4 ${
                        message.isBot
                          ? "bg-card border-border/50"
                          : "bg-wellness-gradient text-white border-0 shadow-soft"
                      }`}
                    >
                      <p className={`text-sm ${message.isBot ? "text-foreground" : "text-white"}`}>
                        {message.content}
                      </p>
                    </Card>
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                {/* AI Response Components */}
                {message.aiResponse && (
                  <div className="space-y-4 max-w-2xl">
                    {/* Coping Strategies */}
                    {message.aiResponse.coping_strategies && message.aiResponse.coping_strategies.length > 0 && (
                      <CopingStrategies 
                        strategies={message.aiResponse.coping_strategies}
                        onStrategyTried={handleStrategyTried}
                      />
                    )}

                    {/* Crisis Resources */}
                    {(message.aiResponse.resources || message.aiResponse.mood_analysis.crisis_indicators.length > 0) && (
                      <CrisisResources 
                        resources={message.aiResponse.resources || []}
                        crisisIndicators={message.aiResponse.mood_analysis.crisis_indicators}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-xs lg:max-w-md">
                  <Card className="p-4 bg-card border-border/50">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">AI is thinking...</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border/50 bg-card p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... (Press Enter to send)"
                className="resize-none border-border/50 focus:border-primary transition-gentle"
                disabled={isTyping}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="bg-wellness-gradient hover:shadow-gentle-glow transition-gentle"
              size="lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI-powered emotional support • Completely private • Not stored anywhere
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;