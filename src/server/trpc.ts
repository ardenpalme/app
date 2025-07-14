import { initTRPC } from "@trpc/server";
import superjson from "superjson"

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
// Avoid exporting the entire t-object
// since it's not very descriptive.
const t = initTRPC.create({
  transformer: superjson, 
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

export const router = t.router
export const publicProcedure = t.procedure;
