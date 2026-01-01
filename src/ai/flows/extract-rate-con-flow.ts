
'use server';
/**
 * @fileOverview A flow to extract information from a rate confirmation document.
 *
 * - extractRateCon - A function that handles the rate confirmation extraction process.
 * - ExtractRateConInput - The input type for the extractRateCon function.
 * - ExtractRateConOutput - The return type for the extractRateCon function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractRateConInputSchema = z.object({
  rateConDataUri: z
    .string()
    .describe(
      "A rate confirmation document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractRateConInput = z.infer<typeof ExtractRateConInputSchema>;

const ExtractRateConOutputSchema = z.object({
  broker: z.string().describe('The name of the broker or company.'),
  loadNumber: z.string().describe('The unique identifier for the load.'),
});
export type ExtractRateConOutput = z.infer<typeof ExtractRateConOutputSchema>;

export async function extractRateCon(input: ExtractRateConInput): Promise<ExtractRateConOutput> {
  return extractRateConFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractRateConPrompt',
  input: { schema: ExtractRateConInputSchema },
  output: { schema: ExtractRateConOutputSchema },
  prompt: `You are an expert logistics coordinator. Your task is to extract key information from the provided Rate Confirmation document.

  Document: {{media url=rateConDataUri}}
  
  Please extract the following information:
  - Broker Name
  - Load Number
  
  Provide the extracted information in the specified JSON format.`,
});

const extractRateConFlow = ai.defineFlow(
  {
    name: 'extractRateConFlow',
    inputSchema: ExtractRateConInputSchema,
    outputSchema: ExtractRateConOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
