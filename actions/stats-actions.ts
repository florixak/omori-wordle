"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { friendship, UserStats, userStats } from "@/db/schema";
import { createEmptyStats } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

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

export const getStreak = async (): Promise<number> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return 0;
  }

  const stats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, session.user.id))
    .limit(1);

  if (stats.length === 0) {
    return 0;
  }

  const [statsRow] = stats;
  if (!statsRow) {
    return 0;
  }

  return statsRow.currentStreak;
};

export const getStatsForUser = async (userId: string): Promise<UserStats> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const isFriend = await db
    .select()
    .from(friendship)
    .where(
      and(
        eq(friendship.requesterId, session.user.id),
        eq(friendship.addresseeId, userId),
        eq(friendship.status, "accepted"),
      ),
    );

  if (isFriend.length === 0) {
    throw new Error("Not a friend");
  }

  const stats = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  if (stats.length === 0) {
    throw new Error("Stats not found");
  }

  const [statsRow] = stats;
  return statsRow;
};
