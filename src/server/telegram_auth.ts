import { parse, validate } from "@telegram-apps/init-data-node";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import { db } from "./db";
import { invites, users } from "./db/schema";

export async function GetTelegramAuth(headers: Headers) {
  // Получаем из Headers данные о пользователе
  const initDataRaw = headers.get("x-trpc-init-data");

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
      role: true,
      photoUrl: true,
      gigaBalance: true,
      ticketsBalance: true,
    }
  });

  // Если пользователя нет, то создаем его
  if (!user) {
    const id = crypto.randomUUID();

    user = (
      await db
        .insert(users)
        .values({
          ...initData.user,
          id: id,
          telegramId: initData.user!.id.toString(),
          photoUrl: initData.user.photoUrl,
          role:
          initData.user!.id.toString() === env.MAIN_ADMIN_TELEGRAM_ID
            ? "ADMIN"
            : "USER",
        })
        .returning({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          username: users.username,
          telegramId: users.telegramId,
          role: users.role,
          photoUrl: users.photoUrl,
          gigaBalance: users.gigaBalance,
          ticketsBalance: users.ticketsBalance,
        })
    )[0]!;

    if (initData.startParam) {
      const ownerLink = await db.query.users.findFirst({
        where: eq(users.telegramId, initData.startParam),
      });

      if (ownerLink) {
				await db.transaction(async (trx) => {
					await trx
						.update(users)
						.set({
              gigaBalance: ownerLink.gigaBalance + 1000,
              ticketsBalance: ownerLink.ticketsBalance + 1,
						})
						.where(eq(users.id, ownerLink.id));
					const invite = (await trx.insert(invites).values({
						inviteId: user?.id ?? "",
						inviterId: ownerLink.id ?? "",
					}).returning({
            invitedAt: invites.invitedAt,
          }))[0]!;
				});
      }
    }
  }

  return {
    ...user,
  };
}
