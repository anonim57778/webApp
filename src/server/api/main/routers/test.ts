import { eq } from "drizzle-orm";
import { TestSchema } from "~/lib/shared/types/test";
import { IdSchema } from "~/lib/shared/types/utils";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { test } from "~/server/db/schema";

// Создаем роутер
export const testRouter = createTRPCRouter({
  // Создаем mutation create, которая принимает в себя TestSchema и ничего не возвращает
  // mutation нужны для изменения данных
  // ctx - контекст приложения, там хранятся:
  // ctx.db - База данных
  // ctx.user - авторизованный пользователь, который вызвал процедуру
  // ctx.bot - telegraf бот, чтобы можно было выполнять действия в телеграме, например отправлять сообщения
  // adminProcedure значит, что эта процедура доступна только администратору
  create: adminProcedure.input(TestSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(test).values(input);
  }),
  // Создаем query getAll, которая ничего не принимает, но возвращает список всех тестов из базы
  // query нужны для получения данных
  // publicProcedure значит, что доступно всем
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.test.findMany();
  }),

  // Мутация delete, которая принимает в себя айди, ничего не возвращает
  delete: adminProcedure.input(IdSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(test).where(eq(test.id, input.id));
  }),
});
