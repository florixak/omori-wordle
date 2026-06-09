"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { user, UserStats, userStats } from "@/db/schema";
import { createEmptyStats } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { isFriend } from "./friends-actions";

export type UserStatsView = {
  stats: UserStats;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

export const getStats = async (
  targetUserId: string,
): Promise<UserStatsView> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (targetUserId !== session.user.id) {
    const isFriendResult = await isFriend(targetUserId);
    if (!isFriendResult) {
      throw new Error("User is not a friend");
    }
  }

  const [userRows, statsRows] = await Promise.all([
    db.select().from(user).where(eq(user.id, targetUserId)).limit(1),
    db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, targetUserId))
      .limit(1),
  ]);

  if (userRows.length === 0) {
    throw new Error("User not found");
  }

  const [userRow] = userRows;
  const stats =
    statsRows.length === 0 ? createEmptyStats(targetUserId) : statsRows[0];

  return {
    stats,
    user: {
      id: userRow.id,
      name: userRow.name,
      image: userRow.image ?? null,
    },
  };
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
