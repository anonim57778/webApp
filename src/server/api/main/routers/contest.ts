import { ContestSchema } from "~/lib/shared/types/contest";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import { contests, invites, users, winsUserContest } from "~/server/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { IdSchema } from "~/lib/shared/types/utils";
import { Calculate } from "~/components/reword-calc";



export const contestRouter = createTRPCRouter({
    create: adminProcedure
        .input(ContestSchema)
        .mutation(async ({ ctx, input }) => {            
            await ctx.db.insert(contests).values({
                ...input,
            }); 
        }),
    getAll: adminProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.query.contests.findMany({
                with: {
                    winners: {
                        with: {
                            user: true,
                        }
                    }
                }
            })
        }),
    setStatus: adminProcedure
        .input(IdSchema)
        .mutation(async ({ ctx, input }) => {
            const contest = await ctx.db.query.contests.findFirst({
                where: eq(contests.id, input.id),
            });

            if (!contest) {
                throw new Error("Конкурс не найден");
            }
                
            await ctx.db.update(contests).set({
                status: "CLOSED",
            }).where(eq(contests.id, input.id));
        }),
    get: publicProcedure
        .query(async ({ ctx }) => {
            const contest = await ctx.db.query.contests.findMany({
                with: {
                    winners: true,
                }
            });

            return contest.sort((a,b) => b.startDate.getTime() - a.startDate.getTime())[0] ?? null;
        }),
    update: adminProcedure
        .input(ContestSchema.merge(IdSchema))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.update(contests).set({
                ...input,
            }).where(eq(contests.id, input.id));
        }),
    delete: adminProcedure
        .input(IdSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(contests).where(eq(contests.id, input.id));
        }),
    createWinners: publicProcedure
        .mutation(async ({ ctx }) => {
            if (ctx.user.role !== "ADMIN") {
                return;
            }

            const contest = await ctx.db.query.contests.findMany();

            const currentContest = contest.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];

        
            const leaders = (await ctx.db.query.users.findMany({
                with: {
                    inviters: {
                        where: and(
                        gte(invites.invitedAt, currentContest!.startDate),
                        lte(invites.invitedAt, currentContest!.endDate),
                        )
                    }
                }
            })).sort((a,b) => b.inviters.length - a.inviters.length).slice(0, 10);

            leaders.map(async (leader, i) => {
                ctx.db.transaction(async (trx) => {
                    await trx.insert(winsUserContest).values({
                        userId: leader.id,
                        contestId: currentContest!.id,
                        place: i + 1,
                    });
                    await trx.update(users).set({
                        ticketsBalance: leader.ticketsBalance + Calculate(i + 1, currentContest!.reward),
                    }).where(eq(users.id, leader.id));
                })

            });
        }),
})