
'use server';
/**
 * @fileOverview A flow to extract information from a rate confirmation document.
 *
 * - extractRateCon - A function that handles the rate confirmation extraction process.
 * - ExtractRateConInput - The input type for the extractRateCon function.
 * - ExtractRateConOutput - The return type for the extractRateCon function.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { Address } from '@/types/address';

const ExtractRateConInputSchema = z.object({
  rateConDataUri: z
    .string()
    .describe(
      "A rate confirmation document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractRateConInput = z.infer<typeof ExtractRateConInputSchema>;

const AddressSchema = z.object({
  street: z.string().describe('The street address.'),
  city: z.string().describe('The city name.'),
  state: z.string().describe('The state code (2 letters, e.g., UT, ID).'),
  zipcode: z.string().describe('The zip code.'),
  country: z.string().nullable().default('USA').transform(val => val || 'USA').describe('The country, defaults to USA.'),
});

const StopSchema = z.object({
  type: z.enum(['pickup', 'delivery']).describe('The type of stop.'),
  address: AddressSchema.describe('The structured address for this stop.'),
  date: z.string().describe('The date for the stop.'),
  time: z.string().describe('The time or time window for the stop.'),
  companyName: z.string().nullish().describe('The company name at this stop location.'),
  phoneNumber: z.string().nullish().describe('The phone number for this stop location.'),
  referenceNotes: z.string().nullish().describe('Reference numbers like PO#, BOL#, or other identifiers.'),
  instructions: z.string().nullish().describe('Special instructions for this stop (dock hours, contact person, etc.).'),
});
export type Stop = z.infer<typeof StopSchema>;


const ExtractRateConOutputSchema = z.object({
  broker: z.string().describe('The name of the broker or company.'),
  loadNumber: z.string().describe('The unique identifier for the load.'),
  stops: z.array(StopSchema).describe('An array of all pickup and delivery stops for the load.'),
  commodity: z.string().describe('The type of commodity being shipped.'),
  weight: z.number().describe('The weight of the load in pounds (lbs).'),
  rate: z.number().describe('The flat rate for the load in dollars.'),
  finePrint: z.string().nullish().describe('Fine print details including late fees, detention charges, layover fees, and other contractual terms.'),
});
export type ExtractRateConOutput = z.infer<typeof ExtractRateConOutputSchema>;

export async function extractRateCon(input: ExtractRateConInput): Promise<ExtractRateConOutput> {
  try {
    // Validate data URI format
    if (!input.rateConDataUri.startsWith('data:')) {
      throw new Error('Invalid data URI format');
    }

    // Check approximate size (base64 is ~1.37x larger than original)
    const base64Data = input.rateConDataUri.split(',')[1];
    const approximateSizeBytes = (base64Data?.length || 0) * 0.75;
    const approximateSizeMB = approximateSizeBytes / (1024 * 1024);

    console.log(`Processing file, approximate size: ${approximateSizeMB.toFixed(2)}MB`);

    if (approximateSizeMB > 10) {
      throw new Error('File size exceeds 10MB limit. Please use a smaller file.');
    }

    // Log file info for debugging
    const mimeMatch = input.rateConDataUri.match(/data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'unknown';
    console.log(`File MIME type: ${mimeType}, Size: ${approximateSizeMB.toFixed(2)}MB`);

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert data URI to proper format for Google AI
    const [header, base64] = input.rateConDataUri.split(',');
    const mimeTypeFromHeader = header.match(/data:([^;]+);/)?.[1] || 'application/pdf';

    console.log('Sending request to Gemini API...');

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64,
          mimeType: mimeTypeFromHeader,
        },
      },
      `Extract information from this rate confirmation document and return as JSON:

{
  "broker": "Company name",
  "loadNumber": "Load number",
  "stops": [
    {
      "type": "pickup",
      "address": {
        "street": "123 Main St",
        "city": "City Name",
        "state": "UT",
        "zipcode": "12345",
        "country": "USA"
      },
      "date": "date",
      "time": "time",
      "companyName": "company name at this location",
      "phoneNumber": "phone number",
      "referenceNotes": "PO#, BOL#, or other reference numbers",
      "instructions": "special instructions, dock hours, contact person, etc."
    },
    {
      "type": "delivery",
      "address": {
        "street": "456 Delivery Rd",
        "city": "City Name",
        "state": "ID",
        "zipcode": "54321",
        "country": "USA"
      },
      "date": "date",
      "time": "time",
      "companyName": "company name at this location",
      "phoneNumber": "phone number",
      "referenceNotes": "PO#, BOL#, or other reference numbers",
      "instructions": "special instructions, dock hours, contact person, etc."
    }
  ],
  "commodity": "Item description",
  "weight": 0,
  "rate": 0,
  "finePrint": "Late fees, detention charges, layover fees, insurance requirements, and any other contractual terms or fine print"
}

Return ONLY valid JSON. weight and rate must be numbers. For each stop, break down the address into separate street, city, state (2-letter code), and zipcode fields. Extract all available stop details including company names, phone numbers, reference numbers, and special instructions. Include any fine print, late fees, or contractual terms in the finePrint field. If information is not visible, omit the optional fields.`,
    ]);

    const response = await result.response;
    const text = response.text();

    console.log('Received response from Gemini API:', text ? 'Success' : 'Empty');

    if (!text) {
      throw new Error('Empty response from AI. Please try a clearer image or enter data manually.');
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON in response:', text);
      throw new Error('Could not parse AI response. Please try again or enter data manually.');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    console.log('Successfully extracted data from rate confirmation');

    return ExtractRateConOutputSchema.parse(parsedData);
  } catch (error) {
    console.error('Error in extractRateCon:', error);
    throw error;
  }
}
