import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { testRouter } from "./routers/test";
import { userRouter } from "./routers/user";

// Создаем общий роутер приложения
export const router = createTRPCRouter({
  // Добавляем тесты, на фронте их можно вызвать через api.test.метод
  test: testRouter,
  // Добавляем пользователей, на фронте их можно вызвать через api.user.метод
  user: userRouter,
});

export type Router = typeof router;
export const createCaller = createCallerFactory(router);
