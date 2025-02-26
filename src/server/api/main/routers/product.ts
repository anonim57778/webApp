import { ProductSchema } from "~/lib/shared/types/product";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../../trpc";
import { products, purchases, users } from "~/server/db/schema";
import { IdSchema } from "~/lib/shared/types/utils";
import { eq } from "drizzle-orm";


export const productRouter = createTRPCRouter({
    create: adminProcedure
        .input(ProductSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(products).values(input);
        }),
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.query.products.findMany();
        }),
    delete: adminProcedure
        .input(IdSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db.delete(products).where(eq(products.id, input.id));
        }),
    update: adminProcedure
        .input(ProductSchema.merge(IdSchema))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.update(products).set(input).where(eq(products.id, input.id));
        }),
    buyProduct: publicProcedure
        .input(IdSchema)
        .mutation(async ({ ctx, input }) => {
            const product = await ctx.db.query.products.findFirst({
                where: eq(products.id, input.id),
            });

            const user = await ctx.db.query.users.findFirst({
                where: eq(users.id, ctx.user.id),
            });

            if (!product) {
                throw new Error("Товар не найден");
            }

            if (user!.ticketsBalance < product.tickets) {
                throw new Error("Недостаточно билетов для покупки товара");
            }

            ctx.db.transaction(async (trx) => {
                await trx.update(users).set({
                    gigaBalance: user!.gigaBalance + product.gigaCoins,
                    ticketsBalance: user!.ticketsBalance - product.tickets,
                }).where(eq(users.id, ctx.user.id));
                await ctx.db.insert(purchases).values({
                    userId: ctx.user.id,
                    productId: product.id,
                });
            })

        })
})