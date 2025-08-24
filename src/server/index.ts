import { router } from './trpc';
import { testRouter} from './routers/test'
import { campaignRouter, creativeRouter, rssRouter, designRouter} from './routers/creative'
import { clerkRouter } from './routers/clerk';

export const appRouter = router({
  test: testRouter,
  creative: creativeRouter,
  campaign: campaignRouter,
  clerk: clerkRouter,
  rss: rssRouter,
  design: designRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

