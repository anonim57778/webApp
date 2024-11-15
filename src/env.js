import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Ссылка на БД
    DATABASE_URL: z.string().url(),

    // Забейте просто
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    // Ссылка на бота
    NEXTAUTH_URL: z.string().url(),

    // Токен бота
    TELEGRAM_BOT_TOKEN: z.string(),

    // ID главного администратора
    MAIN_ADMIN_TELEGRAM_ID: z.string(),
  },

  client: {},
  // устанавливаем переменные
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    MAIN_ADMIN_TELEGRAM_ID: process.env.MAIN_ADMIN_TELEGRAM_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
