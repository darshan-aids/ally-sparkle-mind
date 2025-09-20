import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft, Shield } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatInterface = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm here to listen and support you. This conversation is completely private and anonymous. What's on your mind today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response (in a real app, this would call your AI service)
    setTimeout(() => {
      const responses = [
        "I hear you, and what you're feeling is completely valid. Can you tell me more about what's making you feel this way?",
        "That sounds really challenging. It's okay to feel overwhelmed - you're not alone in this. What would help you feel a bit better right now?",
        "Thank you for sharing that with me. It takes courage to open up about difficult feelings. How long have you been experiencing this?",
        "I understand. Sometimes it helps to break things down into smaller pieces. What's the one thing that's worrying you most?",
        "You're being really brave by talking about this. Let's work through this together. What usually helps you when you're feeling like this?",
      ];

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            <div>
              <h1 className="font-semibold text-foreground">MindfulSpace</h1>
              <p className="text-xs text-muted-foreground">AI Wellness Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary-soft px-3 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Anonymous & Private</span>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 container mx-auto max-w-4xl p-4">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
              >
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
                      <span className="text-xs text-muted-foreground">Typing...</span>
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
            This conversation is private and will not be stored or shared with anyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;