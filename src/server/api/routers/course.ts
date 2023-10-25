import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
    getAllCourses: publicProcedure
        .query(({ ctx }) => {
            return ctx.db.course.findMany();
        }),
    getCourse: publicProcedure
        .input(z.string())
        .query(({ input, ctx }) => {
            return ctx.db.course.findUnique({ where: { id: input }, include: { Unit: true } });
        }),
    getCourseUnits: publicProcedure
        .input(z.string())
        .query(({ input, ctx }) => {
            return ctx.db.unit.findMany({ where: { courseId: input } });
        }),
});
