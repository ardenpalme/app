import { router } from './trpc';
import { testRouter} from './routers/test'
import { campaignRouter, creativeRouter } from './routers/creative'
import { clerkRouter } from './routers/clerk';

export const appRouter = router({
  test: testRouter,
  creative: creativeRouter,
  campaign: campaignRouter,
  clerk: clerkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

