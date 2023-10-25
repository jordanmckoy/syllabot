import { createTRPCRouter } from "~/server/api/trpc";
import { documentsRouter } from "./routers/documents";
import { courseRouter } from "./routers/course";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    documents: documentsRouter,
    course: courseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
