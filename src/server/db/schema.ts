import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const createTable = pgTableCreator((name) => `project_${name}`);

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);
export const UserRoleEnumSchema = z.enum(userRoleEnum.enumValues);
export type UserRoleEnumT = z.infer<typeof UserRoleEnumSchema>;

export const files = createTable("files", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	fileSize: integer("file_size").notNull(),
	contentType: varchar("content_type", { length: 255 }).notNull(),
	objectId: varchar("object_id", { length: 255 }).notNull().unique(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
  });

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
  role: userRoleEnum("role").default("USER").notNull(),
  // Дата создания пользователя
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  photoUrl: varchar("photo_url", { length: 255 }),
  gigaBalance: integer("giga_balance").default(0).notNull(),
  ticketsBalance: integer("tickets_balance").default(0).notNull(),
});

export const usersRelations = relations(users, ({many}) => ({
  invites: many(invites,{relationName: "invite"}),
  inviters: many(invites,{relationName: "inviter"}),
  completeTasks: many(completeTasks),
  purchases: many(purchases),
}))

export const products = createTable("products", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  tickets: integer("tickets").notNull(),
  gigaCoins: integer("giga_coins").notNull(),
})

export const purchases = createTable("purchases", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id").references(() => users.id),
  productId: varchar("product_id", {length: 255}).references(() => products.id),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow().notNull(),
})

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {fields: [purchases.userId], references: [users.id]}),
  product: one(products, {fields: [purchases.productId], references: [products.id]}),
}))


export const invites = createTable("invites", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  inviteId: varchar("invite_id", {length: 255}),
  inviterId: varchar("inviter_id", {length: 255}).references(() => users.id),
  invitedAt: timestamp("invited_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const invitesRelations = relations(invites, ({one}) => ({
  invite: one(users, {fields: [invites.inviteId], references: [users.id], relationName: "invite"}),
  inviter: one(users, {fields: [invites.inviterId], references: [users.id], relationName: "inviter"}),
}))

//Пользователи, занявшие призовые места(1,2 и 3 места соответственно) в том или ином конкурсе, может пригодится для админки
export const winsUserContest = createTable("wins_user_contest", {
  userId: varchar("user_id", {length: 255}).references(() => users.id),
	contestId: varchar("contest_id", {length: 255}).references(() => contests.id),
  place: integer("place").notNull(),
});

export const winsUserContestRelations = relations(winsUserContest, ({one}) => ({
  user: one(users, {fields: [winsUserContest.userId], references: [users.id]}),
  constest: one(contests, {fields: [winsUserContest.contestId], references: [contests.id]}),
}));

//Награды что могут получить пользователи в том или ином конкурсе
export const rewordEnum = pgEnum("reword_enum", ["PEPER", "TICKETS", "TON"]);
export const RewordEnumSchema = z.enum(rewordEnum.enumValues);
export type RewordEnumT = z.infer<typeof RewordEnumSchema>;

export const statusEnum = pgEnum("status_enum", ["ACTIVE", "CLOSED"]);
export const StatusEnumSchema = z.enum(statusEnum.enumValues);
export type StatusEnumT = z.infer<typeof StatusEnumSchema>;

//Таблица конкурсов, мы по сути получаем всех пользователей и сортируем их по количеству приглашенных друзей с начала конкурса
export const contests = createTable("contests", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  //Дата начала конкурса
  startDate: timestamp("start_date", {
    mode: "date",
    withTimezone: true,
  }).defaultNow().notNull(),
  //Дата окончания конкурса
  endDate: timestamp("end_date", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
  //Награда за конкурс, условно 10 билетов или 1000 долларов PEPER
  reward: integer("reward").notNull(),
  //Тип награды, PEPER, TICKETS или TON
  typeReword: rewordEnum("type_reword").notNull(),
  status: statusEnum("status").default("ACTIVE").notNull(),
});

export const contestsRelations = relations(contests, ({many}) => ({
  winners: many(winsUserContest)
}))

export const typeTaskEnum = pgEnum("type_task_enum", ["SUB", "INVITE",]);
export const TypeTaskEnumSchema = z.enum(typeTaskEnum.enumValues);
export type TypeTaskEnumT = z.infer<typeof TypeTaskEnumSchema>;

export const tasks = createTable("tasks", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  taskType: typeTaskEnum("type_task").notNull(),
  reward: integer("reward").notNull(),
  typeReword: rewordEnum("type_reword").notNull(),
  amount: integer("amount").notNull(),
  chanelId: varchar("chanel_id", { length: 255 }),
  creatadAt: timestamp("creatad_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow().notNull()
})

export const completeTasks = createTable("complete_tasks", {
  userId: varchar("user_id").references(() => users.id),
  taskId: varchar("task_id").references(() => tasks.id),
  claimedAt: timestamp("claimed_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow()
})

export const completeTasksRelations = relations(completeTasks, ({one}) => ({
  user: one(users, {fields: [completeTasks.userId], references: [users.id]}),
  task: one(tasks, {fields: [completeTasks.taskId], references: [tasks.id]}),
}))

export const wheelReward = createTable("weel_reward", {
  id: varchar("id", { length: 255 })
  .notNull()
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  typeReward: rewordEnum("type_reward").notNull(),
  reward: integer("reward").notNull(),
})

export const wheelRewardHistory = createTable("wheel_reward_history", {
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  wheelRewardId: varchar("wheel_id", { length: 255 }).references(() => wheelReward.id),
  claimedAt: timestamp("claimed_at").defaultNow(),
})

export const wheelRewardsHistoryRelations = relations(wheelRewardHistory, ({one}) => ({
  user: one(users, {fields: [wheelRewardHistory.userId], references: [users.id]}),
  wheelReward: one(wheelReward, {fields: [wheelRewardHistory.wheelRewardId], references: [wheelReward.id]}),
}))


