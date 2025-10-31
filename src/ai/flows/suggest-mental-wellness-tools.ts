'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting mental wellness tools to users based on their mood, journal entries, and stress triggers.
 *
 * - suggestMentalWellnessTools - A function that suggests mental wellness tools based on user data.
 * - SuggestMentalWellnessToolsInput - The input type for the suggestMentalWellnessTools function.
 * - SuggestMentalWellnessToolsOutput - The return type for the suggestMentalWellnessTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMentalWellnessToolsInputSchema = z.object({
  mood: z
    .string()
    .describe("The user's current mood (e.g., anxious, stressed, happy, sad)."),
  journalEntry: z
    .string()
    .describe('A recent journal entry from the user, describing their thoughts and feelings.'),
  stressTriggers: z
    .string()
    .describe('A comma-separated list of identified stress triggers for the user.'),
});
export type SuggestMentalWellnessToolsInput = z.infer<
  typeof SuggestMentalWellnessToolsInputSchema
>;

const SuggestMentalWellnessToolsOutputSchema = z.object({
  suggestedTools: z
    .array(z.string())
    .describe(
      'A list of suggested mental wellness tools (e.g., guided meditation, breathing exercises, CBT techniques) tailored to the user.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why each tool was suggested based on mood, journal entry and stress triggers.'
    ),
});
export type SuggestMentalWellnessToolsOutput = z.infer<
  typeof SuggestMentalWellnessToolsOutputSchema
>;

export async function suggestMentalWellnessTools(
  input: SuggestMentalWellnessToolsInput
): Promise<SuggestMentalWellnessToolsOutput> {
  return suggestMentalWellnessToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMentalWellnessToolsPrompt',
  input: {schema: SuggestMentalWellnessToolsInputSchema},
  output: {schema: SuggestMentalWellnessToolsOutputSchema},
  prompt: `You are an AI mental wellness assistant. Based on the user's current mood, recent journal entry, and identified stress triggers, suggest a list of mental wellness tools that would be most helpful for them. Explain the reasons why you suggested each tool.

User Mood: {{{mood}}}
Journal Entry: {{{journalEntry}}}
Stress Triggers: {{{stressTriggers}}}

Suggest mental wellness tools that can help with these issues, explaining your reasoning for each recommendation.  The tools should be items such as guided meditation sessions, breathing exercises, CBT techniques, or anxiety grounding techniques.

Format your response as a list of suggested tools with a detailed reason for each recommendation. Follow the schema description.`,
});

const suggestMentalWellnessToolsFlow = ai.defineFlow(
  {
    name: 'suggestMentalWellnessToolsFlow',
    inputSchema: SuggestMentalWellnessToolsInputSchema,
    outputSchema: SuggestMentalWellnessToolsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
