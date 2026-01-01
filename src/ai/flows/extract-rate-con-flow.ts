
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
  pickupLocation: z.string().describe('The pickup location address.'),
  pickupDate: z.string().describe('The pickup date.'),
  pickupTime: z.string().describe('The pickup time or window.'),
  deliveryLocation: z.string().describe('The delivery location address.'),
  deliveryDate: z.string().describe('The delivery date.'),
  deliveryTime: z.string().describe('The delivery time or window.'),
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
  prompt: `You are an expert logistics coordinator. Your task is to extract key information from the provided Rate Confirmation document.

  Document: {{media url=rateConDataUri}}
  
  Please extract the following information:
  - Broker Name
  - Load Number
  - Pickup Location (City, State)
  - Pickup Date (MM/DD/YY)
  - Pickup Time window
  - Delivery Location (City, State)
  - Delivery Date (MM/DD/YY)
  - Delivery Time
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
