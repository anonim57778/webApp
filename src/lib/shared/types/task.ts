import { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import { Router } from "~/server/api/main";
import { RewordEnumSchema, TypeTaskEnumSchema } from "~/server/db/schema";

export const TaskSchema = z.object({
    name: z.string({
        message: "Название задачи должно быть от 1 до 255 символов",
    }).min(1, "Название задачи обязательно").max(255, "Название задачи должно быть до 255 символов"),
    taskType: TypeTaskEnumSchema,
    reward: z.coerce.number().positive("Количество монет должно быть больше 0"),
    typeReword: RewordEnumSchema,
    amount: z.coerce.number().positive("Количество должно быть больше 0"),
    chanelId: z.string().optional(),
})

export type Task = inferProcedureOutput<Router["task"]["getAllTasksAdmin"]>[number];