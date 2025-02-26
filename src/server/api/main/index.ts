import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { fileRouter } from "./routers/file";
import { contestRouter } from "./routers/contest";
import { taskRouter } from "./routers/task";
import { productRouter } from "./routers/product";

// Создаем общий роутер приложения
export const router = createTRPCRouter({
  // Добавляем пользователей, на фронте их можно вызвать через api.user.метод
  user: userRouter,
  file: fileRouter,
  contest: contestRouter,
  task: taskRouter,
  product: productRouter,
});

export type Router = typeof router;
export const createCaller = createCallerFactory(router);
