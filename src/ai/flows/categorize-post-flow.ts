
'use server';

/**
 * @fileOverview This file defines a Genkit flow for categorizing a forum post.
 *
 * - categorizePost - A function that suggests a forum category based on post content.
 * - CategorizePostInput - The input type for the categorizePost function.
 * - CategorizePostOutput - The return type for the categorizePost function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Defines a single available forum category for the AI to choose from.
const ForumCategorySchema = z.object({
  id: z.string().describe('The unique ID of the forum.'),
  name: z.string().describe('The display name of the forum.'),
  description: z.string().describe('A brief description of what the forum is about.'),
});

const CategorizePostInputSchema = z.object({
  postTitle: z.string().describe("The title of the user's forum post."),
  postContent: z.string().describe("The main content of the user's forum post."),
  availableForums: z
    .array(ForumCategorySchema)
    .describe('The list of available forums the post can be categorized into.'),
});
export type CategorizePostInput = z.infer<typeof CategorizePostInputSchema>;

const CategorizePostOutputSchema = z.object({
  forumId: z
    .string()
    .describe('The ID of the most appropriate forum for the post.'),
});
export type CategorizePostOutput = z.infer<typeof CategorizePostOutputSchema>;

export async function categorizePost(
  input: CategorizePostInput
): Promise<CategorizePostOutput> {
  return await categorizePostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizePostPrompt',
  input: { schema: CategorizePostInputSchema },
  output: { schema: CategorizePostOutputSchema },
  prompt: `You are an expert community moderator for a student mental wellness app. Your task is to categorize a new forum post into the most relevant forum based on its title and content.

Analyze the user's post:
- Title: {{{postTitle}}}
- Content: {{{postContent}}}

Here are the available forums:
\`\`\`json
{{{json availableForums}}}
\`\`\`

Review the post and choose the single most appropriate forum ID from the list. Your response must be only the ID of the chosen forum.`,
});

const categorizePostFlow = ai.defineFlow(
  {
    name: 'categorizePostFlow',
    inputSchema: CategorizePostInputSchema,
    outputSchema: CategorizePostOutputSchema,
  },
  async input => {
    // If there's only one forum, just return it to save an AI call.
    if (input.availableForums.length === 1) {
        return { forumId: input.availableForums[0].id };
    }

    const { output } = await prompt(input);
    return output!;
  }
);

    