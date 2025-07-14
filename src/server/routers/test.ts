import { z } from 'zod';
import { publicProcedure, router } from '../trpc'
import { db } from '../db' 

export const testRouter = router({
 getAllUsers : publicProcedure
    .output(z.array(z.object({
      id: z.number(),
      email: z.string().email(),
    })))
    .query(async () => {
      const users = await db.user.findMany({
        select: {
          id: true,
          email: true,
        },
      });
      console.log(users);
      return users;
    }),
});

