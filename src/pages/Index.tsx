import { useState } from "react";
import WellnessHero from "@/components/WellnessHero";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <div onClick={(e) => {
      // Check if clicked element is a CTA button
      const target = e.target as HTMLElement;
      if (target.textContent?.includes("Start Chatting") || target.closest('button')?.textContent?.includes("Start Chatting")) {
        setShowChat(true);
      }
    }}>
      <WellnessHero />
    </div>
  );
};

export default Index;
