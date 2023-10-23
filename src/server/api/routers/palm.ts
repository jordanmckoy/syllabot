import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const palmRouter = createTRPCRouter({
  getPalmResponse: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {

    }),
});
