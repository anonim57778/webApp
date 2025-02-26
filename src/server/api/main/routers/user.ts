import { and, eq, gte, ilike, inArray, isNotNull, lte, notInArray } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/env";
import { IdSchema } from "~/lib/shared/types/utils";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { invites, users} from "~/server/db/schema";
import { bot, isUserSubscribtion } from "~/server/telegram";

export const userRouter = createTRPCRouter({
  // Возвращаем информацию о пользователе
  session: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
  checkSub: publicProcedure
    .query(async ({ ctx }) => {
      const isSubscribtion = await isUserSubscribtion({
        channelId: env.CHANNEL_ID,
        userId: ctx.user.telegramId!,
      });

      return isSubscribtion;
    }),
  getLeaders: publicProcedure
    .query(async ({ ctx }) => {
      const leaders = (await ctx.db.query.users.findMany()).sort((a, b) => b.gigaBalance - a.gigaBalance).slice(0, 11);

      return leaders;
    }),
  getLeadersContest: publicProcedure.query(async ({ ctx }) => {
      // Получаем данные о текущем конкурсе
      const contest = await ctx.db.query.contests.findMany();
    
      // Если конкурса нет, возвращаем null
      if (!contest) return null;

      const leaders = (await ctx.db.query.users.findMany({
        with: {
          inviters: {
            where: and(
              gte(invites.invitedAt, contest[0]!.startDate),
              lte(invites.invitedAt, contest[0]!.endDate),
            ),
          }
        }
      })).sort((a,b) => b.inviters.length - a.inviters.length).slice(0, 10);

      return leaders;
  }),   
  getAll: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findMany({
        where: and(
          input.search ? ilike(users.firstName, `%${input.search}%`) : undefined,
        ),
        with: {
          invites: true,
        }
      })
    }),
  getFriends: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.user.id!),
        with: {
          inviters: {
            with: {
              invite: true,
            },
          }
        }
      });

      return user?.inviters ?? [];
    }),
  dleteFriend: protectedProcedure
    .input(IdSchema)
    .mutation(async ({ ctx, input }) => {
      const invite = await ctx.db.query.invites.findFirst({
        where: and(
          eq(invites.inviteId, input.id),
          eq(invites.inviterId, ctx.user.id!),
        ),
      });

      if (!invite) {
        throw new Error("Такого приглашенного пользователя не найдено");
      }

      ctx.db.transaction(async (trx) => {
        await trx.delete(invites).where(eq(invites.inviteId, input.id));
      });
    })
});
