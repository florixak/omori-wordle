"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { UserStats, userStats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

const createEmptyStats = (userId: string): UserStats => ({
  userId,
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
  lastPlayedDate: null,
  hintsUsed: 0,
  lastHintDate: null,
});

export const getStats = async (): Promise<UserStats> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const stats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, session.user.id))
    .limit(1);

  if (stats.length === 0) {
    return createEmptyStats(session.user.id);
  }

  const [statsRow] = stats;
  return statsRow;
};
