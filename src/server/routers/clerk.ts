import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { userInfoSchema } from '@/schemas/clerk'

import { clerkClient } from "@clerk/express";

export const clerkRouter = router({
  getUserName: publicProcedure
    .input(z.string())
    .output(userInfoSchema)
    .query(async ({input}) => {
      try {
        const user = await clerkClient.users.getUser(input);

        const hasName = user.firstName || user.lastName;
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

        return {
          name: hasName ? fullName : null,
        };
      } catch (err) {
        throw new Error("User not found");
      }
    })
});
