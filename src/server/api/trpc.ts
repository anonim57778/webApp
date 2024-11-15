import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";
import bot from "../telegram";
import { GetTelegramAuth } from "../telegram_auth";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const user = await GetTelegramAuth(opts.headers);

  return {
    db,
    bot,
    user,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ ctx, next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(
    `[TRPC] ${path} took ${end - start}ms to execute. [${ctx.user.telegramId}] ${ctx.user.firstName} @${ctx.user.username}`,
  );

  return result;
});

// Общая процедура, которая всем все разрешает
export const publicProcedure = t.procedure.use(timingMiddleware);

// проверяем на админа, кидаем ошибку, если не админ
// продолжаем, если админ
export const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user.isAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "У вас недостаточно прав для выполнения этой операции",
    });
  }

  return next({
    ctx,
  });
});
