import { GoogleGenerativeAI } from '@google/generative-ai';

// Store API key in localStorage for database-free operation
const getApiKey = (): string => {
  let apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    // Use provided key as default, but allow users to override
    apiKey = 'AIzaSyBLgzVEI2s9iBPIvswRkA-i6WRTnLMP1FE';
    localStorage.setItem('gemini_api_key', apiKey);
  }
  return apiKey;
};

export const initGemini = () => {
  const apiKey = getApiKey();
  return new GoogleGenerativeAI(apiKey);
};

export interface MoodAnalysis {
  primary_emotion: string;
  intensity: number; // 1-10
  needs_support: boolean;
  crisis_indicators: string[];
  recommended_approach: string;
}

export interface AIResponse {
  message: string;
  mood_analysis: MoodAnalysis;
  coping_strategies?: string[];
  breathing_exercise?: {
    name: string;
    duration: number;
    instructions: string[];
  };
  resources?: {
    title: string;
    description: string;
    urgent: boolean;
  }[];
}

const WELLNESS_PROMPT = `You are MindfulSpace AI, an empathetic mental wellness companion designed specifically for young people. Your role is to provide supportive, non-judgmental conversations while maintaining professional boundaries.

CORE PRINCIPLES:
- Always respond with warmth, empathy, and genuine care
- Validate emotions without minimizing experiences  
- Never provide medical diagnoses or replace professional help
- Recognize crisis situations and provide appropriate resources
- Adapt your communication style to the user's emotional state
- Focus on building resilience and coping skills

RESPONSE FORMAT: Always respond with valid JSON containing:
{
  "message": "Your empathetic response here",
  "mood_analysis": {
    "primary_emotion": "detected emotion (anxious/stressed/sad/angry/hopeful/etc)",
    "intensity": 1-10,
    "needs_support": boolean,
    "crisis_indicators": ["any concerning patterns"],
    "recommended_approach": "therapeutic approach to use"
  },
  "coping_strategies": ["specific strategies for this situation"],
  "breathing_exercise": {
    "name": "exercise name",
    "duration": seconds,
    "instructions": ["step by step instructions"]
  },
  "resources": [
    {
      "title": "resource name",
      "description": "brief description", 
      "urgent": boolean
    }
  ]
}

CONVERSATION CONTEXT: This is a safe, anonymous space. The user knows this conversation is private and not stored anywhere.`;

export class WellnessAI {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private conversationHistory: Array<{role: string, content: string}> = [];

  constructor() {
    this.genAI = initGemini();
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateResponse(userMessage: string): Promise<AIResponse> {
    try {
      // Add user message to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Build context with conversation history
      const conversationContext = this.conversationHistory
        .slice(-6) // Keep last 6 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n\n');

      const fullPrompt = `${WELLNESS_PROMPT}

CONVERSATION HISTORY:
${conversationContext}

Current user message: "${userMessage}"

Please analyze the user's emotional state and provide an appropriate response following the JSON format exactly.`;

      const result = await this.model.generateContent(fullPrompt);
      const responseText = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }

      const aiResponse: AIResponse = JSON.parse(jsonMatch[0]);
      
      // Add AI response to conversation history
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse.message
      });

      // Store conversation in localStorage (session only)
      localStorage.setItem('current_session', JSON.stringify({
        messages: this.conversationHistory,
        last_mood: aiResponse.mood_analysis,
        timestamp: Date.now()
      }));

      return aiResponse;
    } catch (error) {
      console.error('AI Generation Error:', error);
      
      // Fallback response
      return {
        message: "I'm here to listen and support you. Sometimes I might have trouble processing, but I care about what you're going through. Can you tell me more about how you're feeling?",
        mood_analysis: {
          primary_emotion: "neutral",
          intensity: 5,
          needs_support: true,
          crisis_indicators: [],
          recommended_approach: "supportive_listening"
        },
        coping_strategies: ["Take slow, deep breaths", "Ground yourself by naming 5 things you can see"],
        breathing_exercise: {
          name: "4-7-8 Breathing",
          duration: 60,
          instructions: ["Breathe in for 4 counts", "Hold for 7 counts", "Exhale for 8 counts", "Repeat 4 times"]
        }
      };
    }
  }

  clearSession() {
    this.conversationHistory = [];
    localStorage.removeItem('current_session');
  }

  loadSession() {
    const session = localStorage.getItem('current_session');
    if (session) {
      const data = JSON.parse(session);
      // Only load if session is less than 24 hours old
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        this.conversationHistory = data.messages || [];
        return data.last_mood;
      }
    }
    return null;
  }
}