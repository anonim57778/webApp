import { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import { Router } from "~/server/api/main";


export const ProductSchema = z.object({
    tickets: z.coerce.number().positive(),
    gigaCoins: z.coerce.number().positive()
})

export type Product = inferProcedureOutput<Router["product"]["getAll"]>[number];