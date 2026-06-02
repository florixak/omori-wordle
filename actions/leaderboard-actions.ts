"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { friendship, gameResult, user } from "@/db/schema";
import { getDailyDate } from "@/lib/daily-word";
import { rankLeaderboard, toUserPreview } from "@/lib/friend-utils";
import type {
  FriendUserPreview,
  FriendsLeaderboard,
} from "@/types/friends-types";
import { and, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";

export const getFriendsLeaderboard = async (): Promise<FriendsLeaderboard> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const today = getDailyDate();

  const acceptedFriendRows = await db
    .select({ addresseeId: friendship.addresseeId })
    .from(friendship)
    .where(
      and(
        eq(friendship.status, "accepted"),
        eq(friendship.requesterId, userId),
      ),
    );

  const friendIds = acceptedFriendRows.map((row) => row.addresseeId);
  const leaderboardUserIds = [userId, ...friendIds];

  const [todayResults, userRows] = await Promise.all([
    db
      .select({
        userId: gameResult.userId,
        attempts: gameResult.attempts,
        won: gameResult.won,
      })
      .from(gameResult)
      .where(
        and(
          eq(gameResult.date, today),
          inArray(gameResult.userId, leaderboardUserIds),
        ),
      ),
    db
      .select()
      .from(user)
      .where(inArray(user.id, leaderboardUserIds)),
  ]);

  const userById = new Map(userRows.map((row) => [row.id, row]));

  const getPreview = (id: string): FriendUserPreview => {
    const row = userById.get(id);
    if (!row) {
      return { id, name: "Unknown", username: null, image: null };
    }

    return toUserPreview(row);
  };

  return {
    date: today,
    entries: rankLeaderboard(todayResults, getPreview),
  };
};
