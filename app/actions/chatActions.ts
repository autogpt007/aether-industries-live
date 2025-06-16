
'use server';

import { smartChatbot, type SmartChatbotInput, type SmartChatbotOutput } from '@/ai/flows/smart-chatbot';

export async function handleChatbotQuery(input: SmartChatbotInput): Promise<SmartChatbotOutput> {
  try {
    const result = await smartChatbot(input);
    return result;
  } catch (error) {
    console.error("Error in smartChatbot flow:", error);
    // It's generally better to let the caller handle UI for errors,
    // but we can return a generic error response if needed.
    return { response: "I'm sorry, but I encountered an issue processing your request. Please try again later." };
  }
}
