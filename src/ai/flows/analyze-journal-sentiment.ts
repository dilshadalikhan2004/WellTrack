'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the sentiment of a journal entry.
 *
 * - analyzeJournalSentiment - A function that analyzes the sentiment of a journal entry.
 * - AnalyzeJournalSentimentInput - The input type for the analyzeJournalSentiment function.
 * - AnalyzeJournalSentimentOutput - The return type for the analyzeJournalSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeJournalSentimentInputSchema = z.object({
  journalEntry: z
    .string()
    .describe('A journal entry from the user, describing their thoughts and feelings.'),
});
export type AnalyzeJournalSentimentInput = z.infer<
  typeof AnalyzeJournalSentimentInputSchema
>;

const AnalyzeJournalSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['Positive', 'Negative', 'Neutral', 'Mixed'])
    .describe(
      'The overall sentiment of the journal entry.'
    ),
    emoji: z.string().describe("An emoji that represents the sentiment (e.g., '😊', '😢', '🤔')."),
  summary: z
    .string()
    .describe(
      'A brief summary of the key emotions and themes detected in the entry.'
    ),
});
export type AnalyzeJournalSentimentOutput = z.infer<
  typeof AnalyzeJournalSentimentOutputSchema
>;

export async function analyzeJournalSentiment(
  input: AnalyzeJournalSentimentInput
): Promise<AnalyzeJournalSentimentOutput> {
  return await analyzeJournalSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeJournalSentimentPrompt',
  input: {schema: AnalyzeJournalSentimentInputSchema},
  output: {schema: AnalyzeJournalSentimentOutputSchema},
  prompt: `You are an expert in sentiment analysis and emotional intelligence. Analyze the following journal entry to determine its overall sentiment and provide a brief summary of the key emotions and themes.

Journal Entry:
{{{journalEntry}}}

Based on the entry, determine if the overall sentiment is Positive, Negative, Neutral, or Mixed. Provide a representative emoji and a concise summary (1-2 sentences) of the main feelings or topics discussed.`,
});

const analyzeJournalSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeJournalSentimentFlow',
    inputSchema: AnalyzeJournalSentimentInputSchema,
    outputSchema: AnalyzeJournalSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
