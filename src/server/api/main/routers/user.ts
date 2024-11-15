import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Возвращаем информацию о пользователе
  session: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
