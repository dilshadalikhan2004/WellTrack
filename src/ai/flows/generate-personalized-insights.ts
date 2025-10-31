'use server';

/**
 * @fileOverview AI flow to generate personalized insights based on user data.
 *
 * This file exports:
 * - `generatePersonalizedInsights`: A function that generates personalized insights and recommendations.
 * - `PersonalizedInsightsInput`: The input type for the `generatePersonalizedInsights` function.
 * - `PersonalizedInsightsOutput`: The output type for the `generatePersonalizedInsights` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const PersonalizedInsightsInputSchema = z.object({
  moodData: z.string().describe('Historical mood data of the user.'),
  habitData: z.string().describe('Historical habit tracking data of the user.'),
  sleepData: z.string().describe('Historical sleep data of the user.'),
  exerciseData: z.string().describe('Historical exercise data of the user.'),
  waterIntakeData: z.string().describe('Historical water intake data of the user.'),
  goalData: z.string().describe('Current goals of the user.'),
});

export type PersonalizedInsightsInput = z.infer<typeof PersonalizedInsightsInputSchema>;

// Define the output schema for the flow
const PersonalizedInsightsOutputSchema = z.object({
  insights: z.string().describe('Personalized insights and recommendations for the user, formatted as an HTML unordered list.'),
});

export type PersonalizedInsightsOutput = z.infer<typeof PersonalizedInsightsOutputSchema>;

// Define the main function that calls the flow
export async function generatePersonalizedInsights(input: PersonalizedInsightsInput): Promise<PersonalizedInsightsOutput> {
  return generatePersonalizedInsightsFlow(input);
}

// Define the prompt
const personalizedInsightsPrompt = ai.definePrompt({
  name: 'personalizedInsightsPrompt',
  input: {schema: PersonalizedInsightsInputSchema},
  output: {schema: PersonalizedInsightsOutputSchema},
  prompt: `You are an AI-powered personal well-being assistant. Analyze the following data to provide personalized insights and recommendations to help the user improve their mental health and overall well-being.

Mood Data: {{{moodData}}}
Habit Data: {{{habitData}}}
Sleep Data: {{{sleepData}}}
Exercise Data: {{{exerciseData}}}
Water IntakeData: {{{waterIntakeData}}}
Current Goals: {{{goalData}}}

Based on this data, provide actionable insights and recommendations, focusing on:
- Identifying patterns and correlations between mood, habits, sleep, and other factors.
- Suggesting specific changes to habits or routines to improve mood and well-being.
- Recommending relevant mental wellness tools or techniques.
- Helping the user achieve their goals by providing tailored advice and support.

Format the entire response as an HTML unordered list (<ul><li>...</li></ul>). Each point should be a separate list item.`,
});

// Define the flow
const generatePersonalizedInsightsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedInsightsFlow',
    inputSchema: PersonalizedInsightsInputSchema,
    outputSchema: PersonalizedInsightsOutputSchema,
  },
  async input => {
    const {output} = await personalizedInsightsPrompt(input);
    return output!;
  }
);
