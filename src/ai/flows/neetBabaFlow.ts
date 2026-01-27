'use server';
/**
 * @fileOverview A simple flow for the NEET BABA AI assistant.
 *
 * - askNeetBaba - A function that takes a user's question and returns an AI response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const neetBabaFlow = ai.defineFlow(
  {
    name: 'neetBabaFlow',
    inputSchema: z.string().describe("The user's question about NEET preparation."),
    outputSchema: z.string().describe("The AI's answer."),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: `You are NEET BABA, an expert AI assistant for students preparing for the NEET medical entrance exam. Your goal is to provide accurate, helpful, and encouraging answers to their questions. Be concise and clear.

      Question: ${prompt}
      
      Answer:`,
      model: 'googleai/gemini-2.5-flash',
      config: {
        temperature: 0.7,
      },
    });

    return llmResponse.text;
  }
);

export async function askNeetBaba(prompt: string): Promise<string> {
    return neetBabaFlow(prompt);
}
