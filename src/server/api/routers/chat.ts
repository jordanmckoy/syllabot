import { redis } from "~/server/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

const chatHistorySchema = z.array(z.tuple([z.string(), z.string()]));
const userInputSchema = z.object({
    userId: z.string(),
    unitId: z.string(),
});
export const chatRouter = createTRPCRouter({
    getHistory: protectedProcedure
        .input(userInputSchema)
        .query(async ({ input }) => {
            const chatHistory = await redis.get(`chat_history:${input.userId}:${input.unitId}`);

            const chatHistoryArray = chatHistory ? await chatHistorySchema.parseAsync(chatHistory) : [];

            return chatHistoryArray;
        }),
    setHistory: protectedProcedure
        .input(z.object({
            userId: z.string(),
            unitId: z.string(),
            chatHistory: z.array(z.tuple([z.string(), z.string()])),
        }))
        .mutation(async ({ input }) => {
            const data = await redis.set(`chat_history:${input.userId}:${input.unitId}`, JSON.stringify(input.chatHistory));
            console.log(data);
            return data;
        }),
    clearHistory: protectedProcedure
        .input(z.object({
            userId: z.string(),
            unitId: z.string(),
        }))
        .mutation(async ({ input }) => {
            const data = await redis.del(`chat_history:${input.userId}:${input.unitId}`);

            return data;
        }),
});
