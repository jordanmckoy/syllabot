import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const fileRouter = createTRPCRouter({
    upload: publicProcedure
        .input(z.any())
        .mutation(async ({ input }) => {
            console.log(input);
        }),
});