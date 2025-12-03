// This is a server-side code.
'use server';

/**
 * @fileOverview This file defines a Genkit flow to predict potential high-stress periods for students.
 *
 * The flow takes a student's schedule and past stress patterns as input and uses AI to predict future high-stress periods.
 * This allows students to proactively prepare and manage their stress levels.
 *
 * @exports predictStressPeriod - An async function that triggers the stress prediction flow.
 * @exports PredictStressPeriodInput - The TypeScript interface for the input schema.
 * @exports PredictStressPeriodOutput - The TypeScript interface for the output schema.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const PredictStressPeriodInputSchema = z.object({
  schedule: z.string().describe('The student schedule in JSON format.'),
  pastStressPatterns: z.string().describe('Past stress patterns of the student in JSON format.'),
});

// Define the output schema for the flow
const PredictStressPeriodOutputSchema = z.object({
  predictedStressPeriods: z.string().describe('Predicted high-stress periods with dates and reasons in JSON format.'),
});

export type PredictStressPeriodInput = z.infer<typeof PredictStressPeriodInputSchema>;
export type PredictStressPeriodOutput = z.infer<typeof PredictStressPeriodOutputSchema>;

// Define the Genkit prompt
const predictStressPeriodPrompt = ai.definePrompt({
  name: 'predictStressPeriodPrompt',
  input: {schema: PredictStressPeriodInputSchema},
  output: {schema: PredictStressPeriodOutputSchema},
  prompt: `You are an AI assistant designed to predict potential high-stress periods for students based on their schedule and past stress patterns.

  Analyze the following student schedule and past stress patterns to predict future high-stress periods, including specific dates and reasons.

  Schedule: {{{schedule}}}
  Past Stress Patterns: {{{pastStressPatterns}}}

  Provide the predicted stress periods in JSON format, including the date and reason for each predicted period.
  `,
});

// Define the Genkit flow
const predictStressPeriodFlow = ai.defineFlow(
  {
    name: 'predictStressPeriodFlow',
    inputSchema: PredictStressPeriodInputSchema,
    outputSchema: PredictStressPeriodOutputSchema,
  },
  async input => {
    const {output} = await predictStressPeriodPrompt(input);
    return output!;
  }
);

/**
 * Predicts potential high-stress periods for a student based on their schedule and past patterns.
 *
 * @param input - The input data containing the student's schedule and past stress patterns.
 * @returns A promise that resolves to the predicted high-stress periods.
 */
export async function predictStressPeriod(input: PredictStressPeriodInput): Promise<PredictStressPeriodOutput> {
  return predictStressPeriodFlow(input);
}
