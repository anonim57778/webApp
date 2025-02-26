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

    CHANNEL_ID: z.string(),

    S3_BUCKET: z.string(),
    S3_ENDPOINT: z.string(),
    S3_REGION: z.string(),
    S3_ACCESS_KEY: z.string(),
    S3_SECRET_KEY: z.string(),
  },

  client: {
    NEXT_PUBLIC_TELEGRAM_BOT_URL: z.string(),
  },
  // устанавливаем переменные
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    MAIN_ADMIN_TELEGRAM_ID: process.env.MAIN_ADMIN_TELEGRAM_ID,
    CHANNEL_ID: process.env.CHANNEL_ID,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ENDPOINT: process.env.S3_ENDPOINT,
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_KEY: process.env.S3_SECRET_KEY,
    NEXT_PUBLIC_TELEGRAM_BOT_URL: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
