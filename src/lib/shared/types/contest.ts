import { z } from "zod";
import { day } from "./utils";
import { RewordEnumSchema } from "~/server/db/schema";
import { inferProcedureOutput } from "@trpc/server";
import { Router } from "~/server/api/main";


export const ContestSchema = z.object({
    name: z.string().min(1, "Название конкурса не может быть пустым"),
    endDate: z
    .date({
      invalid_type_error: "Конец мероприятия не является датой"
    }).min(new Date(new Date().getTime() - day)),
    reward: z.coerce.number().min(1).positive("Количество монет должно быть больше 0"),
    typeReword: RewordEnumSchema,
})

export type Contest = inferProcedureOutput<Router["contest"]["getAll"]>[number];