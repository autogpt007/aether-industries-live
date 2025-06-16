
// src/ai/flows/smart-chatbot.ts
'use server';
/**
 * @fileOverview A smart chatbot AI agent for customer support focused on Freon™ refrigerants and accessories.
 *
 * - smartChatbot - A function that handles the chatbot interactions.
 * - SmartChatbotInput - The input type for the smartChatbot function.
 * - SmartChatbotOutput - The return type for the smartChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartChatbotInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
  orderId: z.string().optional().describe('The order ID if the query is related to an order.'),
  epaCertificationNumber: z.string().optional().describe('User EPA certification number, if relevant to the query.'),
});
export type SmartChatbotInput = z.infer<typeof SmartChatbotInputSchema>;

const SmartChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
  requiresFollowUp: z.boolean().optional().describe('Indicates if the query requires human follow-up.'),
  followUpTopic: z.string().optional().describe('The topic for human follow-up if needed.'),
});
export type SmartChatbotOutput = z.infer<typeof SmartChatbotOutputSchema>;

export async function smartChatbot(input: SmartChatbotInput): Promise<SmartChatbotOutput> {
  return smartChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartChatbotPrompt',
  input: {schema: SmartChatbotInputSchema},
  output: {schema: SmartChatbotOutputSchema},
  prompt: `You are a customer support chatbot for Aether Industries, a specialized supplier of genuine Freon™ brand refrigerants and related HVAC/R accessories (like manifold gauges, recovery machines, vacuum pumps, leak detectors).

Your primary goal is to provide helpful, accurate, and concise answers to customer questions regarding:
- Freon™ refrigerant products (e.g., R-410A, R-134a, R-32, MO99/R-438A): availability, properties, typical applications, container sizes.
- Refrigerant accessories: compatibility, features, usage.
- EPA regulations and Section 608 certification requirements for purchasing and handling refrigerants. Refer users to the /disclaimers/refrigerant-certification page for detailed info.
- Order status (if an order ID is provided).
- Shipping policies, especially for hazardous materials like refrigerants.
- Return policies for refrigerants and accessories.
- Account inquiries.

General Guidelines:
- Be friendly, professional, and efficient.
- If a question is outside your scope (e.g., specific diagnostic advice for an HVAC system, complex legal interpretations), politely state that you cannot answer and suggest contacting a qualified technician or Aether Industries human support. Set 'requiresFollowUp' to true and 'followUpTopic' appropriately.
- If the user asks about purchasing a regulated refrigerant, gently remind them about EPA certification requirements and ask if they have their certification.
- Do not provide pricing unless it's explicitly available and you are certain. For bulk pricing or unlisted items, guide them to "Request a Quote".
- Use "Freon™" when referring to the brand.
- Keep responses concise and easy to understand for busy technicians.

User Query: {{{query}}}
{{#if orderId}}
Order ID: {{{orderId}}}
{{/if}}
{{#if epaCertificationNumber}}
User Mentioned EPA Certification: {{{epaCertificationNumber}}}
{{/if}}

Provide your response below:
`,
});

const smartChatbotFlow = ai.defineFlow(
  {
    name: 'smartChatbotFlow',
    inputSchema: SmartChatbotInputSchema,
    outputSchema: SmartChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        return { response: "I'm sorry, I wasn't able to generate a response. Please try rephrasing your question or contact support.", requiresFollowUp: true, followUpTopic: "No response from LLM"};
    }
    // Basic check if the LLM itself suggests follow-up (though the prompt guides it to set fields)
    if (output.response.toLowerCase().includes("contact human support") || output.response.toLowerCase().includes("i cannot answer")) {
        output.requiresFollowUp = true;
        output.followUpTopic = output.followUpTopic || "Complex query";
    }
    return output;
  }
);
