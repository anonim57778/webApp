import { TaskSchema } from "~/lib/shared/types/task";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import { completeTasks, invites, tasks, users } from "~/server/db/schema";
import { IdSchema } from "~/lib/shared/types/utils";
import { and, eq, gt, gte, ilike, lte } from "drizzle-orm";
import { z } from "zod";
import { isUserSubscribtion } from "~/server/telegram";


export const taskRouter = createTRPCRouter({
    create: adminProcedure
        .input(TaskSchema)
        .mutation(async ({ ctx, input }) => {
            let taskAmount = 0;

            if (input.taskType == "SUB") {
                taskAmount = 1;
            } else {
                taskAmount = input.amount;
            }
            await ctx.db.insert(tasks).values({
                ...input,
                amount: taskAmount,
            })
        }),
    update: adminProcedure
        .input(TaskSchema.merge(IdSchema))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.update(tasks).set({
                ...input,
            }).where(eq(tasks.id, input.id));
        }),
    delete: adminProcedure
        .input(IdSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
        }),
    getAllTasksAdmin: adminProcedure
        .input(z.object({
            search: z.string().optional()
        }))
        .query(async ({ ctx, input }) => {
            return await ctx.db.query.tasks.findMany({
                where: and(
                    input.search ? ilike(tasks.name, `%${input.search}%`) : undefined
                )
            })
        }),
    getAllTasksUser: publicProcedure
        .query(async ({ ctx }) => {
            let doneCount = 0;
            const resultTask: {
                id: string,
                name: string,
                reword: number,
                rewordType: string,
                status: boolean,
                chanelId: string | null,
                amount: number,
                done: number,
                complete: boolean,
            }[] = [];

            const tasks = await ctx.db.query.tasks.findMany();

            for (const task of tasks) {
                if (task.taskType == "INVITE") {
                    const user = await ctx.db.query.users.findFirst({
                        where: eq(users.id, ctx.user.id),
                        with: {
                            inviters: {
                                where: and(
                                    gte(invites.invitedAt, task.creatadAt),
                                ),
                            }
                        }
                    });

                    doneCount = user?.inviters.length || 0;
                } else if (task.taskType == "SUB") {
                    const isSub = await isUserSubscribtion({userId: ctx.user.telegramId, channelId: task.chanelId!});

                    doneCount = isSub ? 1 : 0;
                }

                const completeTask = await ctx.db.query.completeTasks.findFirst({
                    where: and(
                        eq(completeTasks.userId, ctx.user.id),
                        eq(completeTasks.taskId, task.id),
                    ),
                })
                
                resultTask.push({
                    id: task.id,
                    name: task.name,
                    reword: task.reward,
                    rewordType: task.typeReword,
                    status: doneCount >= task.amount,
                    chanelId: task.chanelId,
                    amount: task.amount,
                    done: doneCount,
                    complete: completeTask ? true : false,
                })
            }

            return resultTask;
        }),
    takeTask: publicProcedure
        .input(IdSchema)
        .mutation(async ({ ctx, input }) => {
            const task = await ctx.db.query.tasks.findFirst({
                where: eq(tasks.id, input.id),
            })

            ctx.db.transaction(async (trx) => {
                await trx.insert(completeTasks).values({
                    userId: ctx.user.id,
                    taskId: input.id,
                });

                await trx.update(users).set({
                    gigaBalance: ctx.user.gigaBalance + task?.reward!
                }).where(eq(users.id, ctx.user.id));
            })
        })
})