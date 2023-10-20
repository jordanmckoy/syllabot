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

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  getPalmStory: protectedProcedure.query(async () => {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta3/models/text-bison-001:generateText?key=${env.PALM_KEY}`;

    const requestData = {
      prompt: {
        text: "Write a story about a magic backpack"
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

      console.log("Output:", output);

      return output ?? "No response";

    } catch (error: any) {

      console.error("Error:", error);

      return error.code;
    }
  }),
});
