'use server';

/**
 * @fileOverview A Genkit flow for a conversational AI personal counselor.
 *
 * - personalCounselor - A function that provides a conversational response from the AI counselor.
 * - PersonalCounselorInput - The input type for the personalCounselor function.
 * - PersonalCounselorOutput - The return type for the personalCounselor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const PersonalCounselorInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history between the user and the AI.'),
  message: z.string().describe("The user's latest message."),
});
export type PersonalCounselorInput = z.infer<typeof PersonalCounselorInputSchema>;

const PersonalCounselorOutputSchema = z.object({
  response: z.string().describe("The AI counselor's response."),
});
export type PersonalCounselorOutput = z.infer<typeof PersonalCounselorOutputSchema>;

export async function personalCounselor(
  input: PersonalCounselorInput
): Promise<PersonalCounselorOutput> {
  return personalCounselorFlow(input);
}

const counselorPrompt = ai.definePrompt({
  name: 'personalCounselorPrompt',
  input: { schema: PersonalCounselorInputSchema },
  output: { schema: PersonalCounselorOutputSchema },
  prompt: `You are a compassionate, professional, and friendly AI personal counselor. Your goal is to provide a safe, non-judgmental space for users to express their thoughts and feelings. Be supportive, empathetic, and offer constructive guidance.

Your core principles are:
1.  **Listen Actively:** Pay close attention to the user's words and the emotions behind them.
2.  **Show Empathy:** Validate the user's feelings (e.g., "That sounds really difficult," or "I can understand why you would feel that way.").
3.  **Ask Open-Ended Questions:** Encourage the user to elaborate (e.g., "How did that make you feel?" or "What was that experience like for you?").
4.  **Offer Gentle Guidance:** Suggest coping strategies, mindfulness techniques, or reframing perspectives. Do not give direct advice or commands.
5.  **Maintain a Professional Boundary:** Always remember you are an AI. Do not claim to have personal experiences or feelings. If the user's situation seems serious (e.g., mentions of self-harm, severe depression, or crisis), you MUST gently guide them to seek help from a real, qualified professional. For example: "It sounds like you're going through a lot right now. While I'm here to listen, for serious situations like this, it's really important to talk to a qualified therapist or a crisis support line. They are trained to provide the best possible support."

Conversation History:
{{#each history}}
**{{role}}**: {{{content}}}
{{/each}}

User's new message:
{{{message}}}

Based on this conversation, provide a warm, professional, and helpful response.`,
});

const personalCounselorFlow = ai.defineFlow(
  {
    name: 'personalCounselorFlow',
    inputSchema: PersonalCounselorInputSchema,
    outputSchema: PersonalCounselorOutputSchema,
  },
  async (input) => {
    const { output } = await counselorPrompt(input);
    return output!;
  }
);
