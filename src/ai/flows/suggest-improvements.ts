'use server';
/**
 * @fileOverview Provides code improvement suggestions using AI.
 *
 * - suggestImprovements - A function that takes code as input and returns improvement suggestions.
 * - SuggestImprovementsInput - The input type for the suggestImprovements function.
 * - SuggestImprovementsOutput - The return type for the suggestImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestImprovementsInputSchema = z.object({
  code: z.string().describe('The code to be improved.'),
  language: z.string().describe('The programming language of the code.'),
});
export type SuggestImprovementsInput = z.infer<typeof SuggestImprovementsInputSchema>;

const SuggestImprovementsOutputSchema = z.object({
  improvements: z.array(z.string()).describe('An array of suggested improvements for the code.'),
});
export type SuggestImprovementsOutput = z.infer<typeof SuggestImprovementsOutputSchema>;

export async function suggestImprovements(input: SuggestImprovementsInput): Promise<SuggestImprovementsOutput> {
  return suggestImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestImprovementsPrompt',
  input: {schema: SuggestImprovementsInputSchema},
  output: {schema: SuggestImprovementsOutputSchema},
  prompt: `You are an AI code assistant that suggests improvements to the given code. Provide specific and actionable advice.

Language: {{{language}}}
Code:
{{{
      code
    }}}

Improvements (in array format):
`, 
});

const suggestImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestImprovementsFlow',
    inputSchema: SuggestImprovementsInputSchema,
    outputSchema: SuggestImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
