import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  serial,
  integer,
  json,
} from "drizzle-orm/pg-core";
import { check } from "drizzle-orm/pg-core";
import { uniqueIndex } from "drizzle-orm/pg-core/indexes";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const gameResult = pgTable(
  "game_result",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // Date as 'YYYY-MM-DD' string (no timestamp).
    date: text("date").notNull(),

    // Store word and its length to render history without lookups.
    word: text("word").notNull(),
    wordLength: integer("word_length").notNull(),

    // attempts: 1–6 = win in N tries, 0 = loss
    attempts: integer("attempts").notNull(),
    won: boolean("won").notNull(),

    // Ordered sequence of guesses for history/stats.
    guesses: json("guesses").$type<string[]>().notNull(),

    // Nullable: may be null if player leaves the game open overnight.
    timeSeconds: integer("time_seconds"),

    completedAt: timestamp("completed_at").defaultNow(),
  },
  (t) => [
    check(
      "game_result_date_format_check",
      sql`${t.date} ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'`,
    ),
    check(
      "game_result_word_uppercase_check",
      sql`${t.word} = upper(${t.word})`,
    ),
    check(
      "game_result_word_length_matches_check",
      sql`${t.wordLength} = char_length(${t.word})`,
    ),
    uniqueIndex("unique_user_date").on(t.userId, t.date),
    index("idx_game_result_date").on(t.date),
  ],
);

export const userStats = pgTable(
  "user_stats",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),

    gamesPlayed: integer("games_played").default(0).notNull(),
    gamesWon: integer("games_won").default(0).notNull(),
    currentStreak: integer("current_streak").default(0).notNull(),
    maxStreak: integer("max_streak").default(0).notNull(),

    // Guess distribution keys: '1'..'6' for wins, '0' for losses.
    guessDistribution: json("guess_distribution")
      .$type<Record<string, number>>()
      .default({})
      .notNull(),
    // lastPlayedDate used to determine streak resets.
    lastPlayedDate: text("last_played_date"),
  },
  (t) => [
    check(
      "user_stats_last_played_date_format_check",
      sql`(${t.lastPlayedDate} IS NULL OR ${t.lastPlayedDate} ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$')`,
    ),
  ],
);

export const friendship = pgTable(
  "friendship",
  {
    id: serial("id").primaryKey(),
    requesterId: text("requester_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    addresseeId: text("addressee_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // Social model: 'pending' = single request row; 'accepted' = two reciprocal rows.
    // Query friends with: WHERE requesterId = userId AND status = 'accepted'.
    status: text("status", { enum: ["pending", "accepted"] })
      .notNull()
      .default("pending"),

    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    check(
      "friendship_no_self_friend_check",
      sql`${t.requesterId} <> ${t.addresseeId}`,
    ),
    uniqueIndex("unique_friendship").on(t.requesterId, t.addresseeId),
    index("idx_friendship_requester").on(t.requesterId),
    index("idx_friendship_addressee").on(t.addresseeId),
  ],
);

export type User = typeof user.$inferSelect;
export type GameResult = typeof gameResult.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type Friendship = typeof friendship.$inferSelect;

export type NewGameResult = typeof gameResult.$inferInsert;
export type NewFriendship = typeof friendship.$inferInsert;
