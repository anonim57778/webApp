import { inferProcedureOutput } from "@trpc/server";
import { z } from "zod";
import { Router } from "~/server/api/main";

export const TestSchema = z.object({
  name: z
    .string({
      message: "Введите имя",
    })
    .min(3, "Имя должно быть длиной не менее 3 символов")
    .max(255, "Имя должно быть длиной не более 255 символов"),
  description: z
    .string({
      message: "Введите описание",
    })
    .min(3, "Описание должно быть длиной не менее 3 символов"),
});

export type Test = inferProcedureOutput<Router["test"]["getAll"]>[number];
