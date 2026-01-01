
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

const StopSchema = z.object({
  type: z.enum(['pickup', 'delivery']).describe('The type of stop.'),
  location: z.string().describe('The location address for the stop.'),
  date: z.string().describe('The date for the stop.'),
  time: z.string().describe('The time or time window for the stop.'),
});
export type Stop = z.infer<typeof StopSchema>;


const ExtractRateConOutputSchema = z.object({
  broker: z.string().describe('The name of the broker or company.'),
  loadNumber: z.string().describe('The unique identifier for the load.'),
  stops: z.array(StopSchema).describe('An array of all pickup and delivery stops for the load.'),
  commodity: z.string().describe('The type of commodity being shipped.'),
  weight: z.number().describe('The weight of the load in pounds (lbs).'),
  rate: z.number().describe('The flat rate for the load in dollars.'),
});
export type ExtractRateConOutput = z.infer<typeof ExtractRateConOutputSchema>;

export async function extractRateCon(input: ExtractRateConInput): Promise<ExtractRateConOutput> {
  return extractRateConFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractRateConPrompt',
  input: { schema: ExtractRateConInputSchema },
  output: { schema: ExtractRateConOutputSchema },
  prompt: `You are an expert logistics coordinator. Your task is to extract key information from the provided Rate Confirmation document, including all stops.

  Document: {{media url=rateConDataUri}}
  
  Please extract the following information:
  - Broker Name
  - Load Number
  - All Stops (pickups and deliveries), in chronological order.
  - Commodity
  - Weight (in lbs)
  - Rate (in dollars)
  
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
