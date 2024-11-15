import { parse, validate } from "@telegram-apps/init-data-node";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import { db } from "./db";
import { users } from "./db/schema";

export async function GetTelegramAuth(headers: Headers) {
  // Получаем из Headers данные о пользователе
  const initDataRaw = headers.get("x-trpc-init-data");
  // Получаем стартовый аргумент (например ссылка на бота: t.me/mycoolbot?start=123123)
  // В startParam будет 123
  // Это полезно для реферальных ссылок
  const startParam = headers.get("x-trpc-start-param");

  if (!initDataRaw) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Проверяем подлинность initData
  try {
    validate(initDataRaw, env.TELEGRAM_BOT_TOKEN);
  } catch (_error) {
    console.error(_error);
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Получаем структурированные данные из initDataRaw
  const initData = parse(initDataRaw);

  if (!initData || !initData.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Получаем пользователя
  let user = await db.query.users.findFirst({
    where: eq(users.telegramId, initData.user.id.toString()),
    columns: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      telegramId: true,
    },
  });

  // Если пользователя нет, то создаем его
  if (!user) {
    user = (
      await db
        .insert(users)
        .values({
          ...initData.user,
          id: undefined,
          telegramId: initData.user!.id.toString(),
        })
        .returning({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username,
          telegramId: users.telegramId,
        })
    )[0]!;
  }

  return {
    ...user,
    // Если пользователь администратор, то даем админку
    isAdmin: user.telegramId === env.MAIN_ADMIN_TELEGRAM_ID,
  };
}
