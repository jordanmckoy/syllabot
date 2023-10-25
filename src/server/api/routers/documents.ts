import { addToVectorStore } from "~/server/helpers/langchain";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { notesSchema } from "~/utils/schemas";

export const documentsRouter = createTRPCRouter({
    createDocument: publicProcedure
        .input(notesSchema)
        .mutation(async ({ input }) => {
            addToVectorStore(input.notes, input.unitId);
        }),
});
