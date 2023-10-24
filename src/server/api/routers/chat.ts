import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { remark } from 'remark';
import html from 'remark-html';
import { getChatGPTResponse } from "~/server/helpers/chatGPT";

export const chatRouter = createTRPCRouter({
    getUnitNotes: protectedProcedure
        .input(z.object({
            prompt: z.string(),
            userId: z.string(),
            unitId: z.number(),
        }))
        .query(async ({ input }) => {
            if (!input) {
                return "Please provide input";
            }

            console.log("Running getChatGPTResponse");

            const result = await getChatGPTResponse(input);

            const processedContent = await remark()
                .use(html)
                .process(result);

            const contentHtml = processedContent.toString();

            return contentHtml
        }),

});