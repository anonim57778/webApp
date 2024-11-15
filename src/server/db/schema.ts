import {
  pgEnum,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `project_${name}`);

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

// Таблица пользователей
export const users = createTable("user", {
  // Айди в формате UUID
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Основные данные о пользователе
  username: varchar("username", { length: 255 }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }),
  telegramId: varchar("telegram_id", { length: 255 }).unique().notNull(),

  // Дата создания пользователя
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

// Таблица тестов
export const test = createTable("test", {
  // Айди в формате UUID
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Основные данные о тесте
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
});
