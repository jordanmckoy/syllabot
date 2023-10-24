import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";

export const courseRouter = createTRPCRouter({
    getAllUnits: protectedProcedure
        .input(z.object({ courseId: z.number() }))
        .query(async ({ input }) => {
            const query = await db.unit.findMany({
                where: {
                    courseId: input.courseId,
                },
            });
            return query;
        }),
});