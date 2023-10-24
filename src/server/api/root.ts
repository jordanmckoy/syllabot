import { createTRPCRouter } from "~/server/api/trpc";
import { chatRouter } from "./routers/chat";
import { courseRouter } from "./routers/course";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    chat: chatRouter,
    course: courseRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
