import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { askOpenAi } from "~/server/ai";
import { remark } from 'remark';
import html from 'remark-html';

export const chatGPTRouter = createTRPCRouter({
  getUnitNotes: protectedProcedure
    .input(z.object({
      id: z.number(),
      courseId: z.number(),
      unitNumber: z.number(),
      unitName: z.string(),
      specificLearningObjectives: z.string().nullable(),
      content: z.string().nullable()
    }).nullable())
    .query(async ({ input }) => {
      if (!input) {
        return "Please provide input";
      }

      const result = await askOpenAi(input);

      const processedContent = await remark()
        .use(html)
        .process(result);

      const contentHtml = processedContent.toString();

      return contentHtml
    }),

});
