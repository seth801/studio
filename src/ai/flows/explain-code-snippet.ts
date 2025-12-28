'use server';

/**
 * @fileOverview This file defines a Genkit flow for explaining code snippets.
 *
 * - explainCodeSnippet - A function that takes a code snippet and explains its functionality.
 * - ExplainCodeSnippetInput - The input type for the explainCodeSnippet function.
 * - ExplainCodeSnippetOutput - The return type for the explainCodeSnippet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeSnippetInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet to be explained.'),
  language: z.string().optional().describe('The programming language of the code snippet.'),
});

export type ExplainCodeSnippetInput = z.infer<typeof ExplainCodeSnippetInputSchema>;

const ExplainCodeSnippetOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the code snippet.'),
});

export type ExplainCodeSnippetOutput = z.infer<typeof ExplainCodeSnippetOutputSchema>;

export async function explainCodeSnippet(input: ExplainCodeSnippetInput): Promise<ExplainCodeSnippetOutput> {
  return explainCodeSnippetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodeSnippetPrompt',
  input: {schema: ExplainCodeSnippetInputSchema},
  output: {schema: ExplainCodeSnippetOutputSchema},
  prompt: `You are an expert software developer. Explain the functionality of the following code snippet. Be thorough and detailed, but avoid being verbose.

Language: {{language}}
Code Snippet:
\`\`\`{{language}}
{{{codeSnippet}}}
\`\`\`
`,
});

const explainCodeSnippetFlow = ai.defineFlow(
  {
    name: 'explainCodeSnippetFlow',
    inputSchema: ExplainCodeSnippetInputSchema,
    outputSchema: ExplainCodeSnippetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
