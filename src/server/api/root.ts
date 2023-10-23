import { createTRPCRouter } from "~/server/api/trpc";
import { palmRouter } from "./routers/palm";
import { chatGPTRouter } from "./routers/chatGPT";
import { courseRouter } from "./routers/course";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  palm: palmRouter,
  chatGPT: chatGPTRouter,
  course: courseRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
