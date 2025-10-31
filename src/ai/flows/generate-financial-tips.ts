
'use server';
/**
 * @fileOverview A Genkit flow to generate financial tips based on user transactions.
 *
 * - generateFinancialTips - A function that analyzes transactions and provides tips.
 * - GenerateFinancialTipsInput - The input type for the generateFinancialTips function.
 * - GenerateFinancialTipsOutput - The return type for the generateFinancialTips function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string(),
  amount: z.number(),
  description: z.string(),
  timestamp: z.string(),
});

const GenerateFinancialTipsInputSchema = z.object({
  transactions: z.array(TransactionSchema).describe('A list of recent financial transactions.'),
  balance: z.number().describe('The current account balance.'),
});
type GenerateFinancialTipsInput = z.infer<typeof GenerateFinancialTipsInputSchema>;

const GenerateFinancialTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe('A list of 2-3 actionable, personalized financial tips for a student in India.'),
  summary: z.string().describe('A brief, encouraging summary of the user\'s recent financial activity.'),
});
type GenerateFinancialTipsOutput = z.infer<typeof GenerateFinancialTipsOutputSchema>;

export async function generateFinancialTips(
  input: GenerateFinancialTipsInput
): Promise<GenerateFinancialTipsOutput> {
  return await generateFinancialTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialTipsPrompt',
  input: { schema: GenerateFinancialTipsInputSchema },
  output: { schema: GenerateFinancialTipsOutputSchema },
  prompt: `You are a friendly financial advisor for students in India. Your goal is to provide simple, actionable, and encouraging advice based on their recent spending habits. The currency is Rupees (₹).

Analyze the following financial data:
- Current Balance: ₹{{{balance}}}
- Recent Transactions:
\`\`\`json
{{{json transactions}}}
\`\`\`

Based on this data, provide a brief, encouraging summary of their spending and 2-3 personalized, actionable tips to help them manage their money better. Focus on common student scenarios like managing pocket money, food expenses, and entertainment. Keep the tone light, supportive, and non-judgmental.`,
});

const generateFinancialTipsFlow = ai.defineFlow(
  {
    name: 'generateFinancialTipsFlow',
    inputSchema: GenerateFinancialTipsInputSchema,
    outputSchema: GenerateFinancialTipsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
