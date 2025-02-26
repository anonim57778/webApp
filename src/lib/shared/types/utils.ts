import { z } from "zod";

export const IdSchema = z.object({
  id: z
    .string({
      required_error: "Необходимо указать идентификатор",
      invalid_type_error: "Неверный тип идентификатора",
    })
    .min(1, "Необходимо указать идентификатор"),
});

export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;
