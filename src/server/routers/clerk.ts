import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { userInfoSchema } from '@/schemas/clerk'

import { clerkClient } from "@clerk/nextjs/server"

export const clerkRouter = router({
  getUserName: publicProcedure
    .input(z.string())
    .output(userInfoSchema)
    .query(async ({input}) => {
      console.log(clerkClient.users);

      return {name: "John Doe"}
    })
});
