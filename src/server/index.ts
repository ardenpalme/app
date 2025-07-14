import { router } from './trpc';
import { testRouter} from './routers/test'
import { campaignRouter, creativeRouter } from './routers/creative'

export const appRouter = router({
  test: testRouter,
  creative: creativeRouter,
  campaign: campaignRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

