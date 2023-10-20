import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import axios from 'axios';
import { env } from "~/env.mjs";

interface Candidate {
  output: string;
  safetyRatings: SafetyRating[];
}

interface SafetyRating {
  category: string;
  probability: string;
}

interface GenerateTextResponse {
  candidates: Candidate[];
}

export const palmRouter = createTRPCRouter({
  getPalmResponse: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${env.PALM_KEY}`;

      const requestData = {
        prompt: {
          text: input.text
        }
      };

      const headers = {
        'Content-Type': 'application/json',
      };

      try {
        const response = await axios.post(apiUrl, requestData, { headers });

        const parsedResponse = response.data as GenerateTextResponse;

        if (!parsedResponse.candidates) {
          return "No candidates";
        }

        const output = parsedResponse.candidates[0]?.output;

        return output ?? "No response";

      } catch (error: any) {

        console.error("Error:", error);

        return error.code;
      }

    }),
});
