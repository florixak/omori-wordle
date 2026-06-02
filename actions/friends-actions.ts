"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { friendship, user } from "@/db/schema";
import type {
  FriendActionResult,
  FriendListEntry,
  FriendUserPreview,
  FriendsOverview,
  PendingFriendRequest,
} from "@/types/friends-types";
import { toUserPreview } from "@/lib/friend-utils";
import { and, eq, inArray, ne, or, sql } from "drizzle-orm";
import { headers } from "next/headers";

const requireSession = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
};

export const getFriendsOverview = async (): Promise<FriendsOverview> => {
  const session = await requireSession();
  const userId = session.user.id;

  const [outgoingPendingRows, incomingPendingRows, acceptedFriendRows] =
    await Promise.all([
      db
        .select()
        .from(friendship)
        .where(
          and(
            eq(friendship.status, "pending"),
            eq(friendship.requesterId, userId),
          ),
        ),
      db
        .select()
        .from(friendship)
        .where(
          and(
            eq(friendship.status, "pending"),
            eq(friendship.addresseeId, userId),
          ),
        ),
      db
        .select()
        .from(friendship)
        .where(
          and(
            eq(friendship.status, "accepted"),
            eq(friendship.requesterId, userId),
          ),
        ),
    ]);

  const friendIds = acceptedFriendRows.map((row) => row.addresseeId);
  const relatedUserIds = [
    ...new Set([
      ...friendIds,
      ...outgoingPendingRows.map((row) => row.addresseeId),
      ...incomingPendingRows.map((row) => row.requesterId),
    ]),
  ];

  const userRows =
    relatedUserIds.length > 0
      ? await db.select().from(user).where(inArray(user.id, relatedUserIds))
      : [];

  const userById = new Map(userRows.map((row) => [row.id, row]));

  const getPreview = (id: string): FriendUserPreview => {
    const row = userById.get(id);
    if (!row) {
      return { id, name: "Unknown", username: null, image: null };
    }

    return toUserPreview(row);
  };

  const pendingRequests: PendingFriendRequest[] = [
    ...incomingPendingRows.map((row) => ({
      id: row.id,
      user: getPreview(row.requesterId),
      direction: "incoming" as const,
    })),
    ...outgoingPendingRows.map((row) => ({
      id: row.id,
      user: getPreview(row.addresseeId),
      direction: "outgoing" as const,
    })),
  ];

  const friends: FriendListEntry[] = acceptedFriendRows.map((row) => ({
    user: getPreview(row.addresseeId),
  }));

  return {
    pendingRequests,
    friends,
  };
};

export const searchUser = async (
  username: string,
): Promise<FriendUserPreview | null> => {
  const session = await requireSession();

  const normalized = username.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const searchResult = await db
    .select()
    .from(user)
    .where(
      and(
        sql`lower(${user.name}) = ${normalized}`,
        ne(user.id, session.user.id),
      ),
    )
    .limit(1);

  if (searchResult.length === 0) {
    return null;
  }

  const [userRow] = searchResult;

  return {
    id: userRow.id,
    name: userRow.name,
    username: userRow.name,
    image: userRow.image ?? null,
  };
};

export const sendFriendRequest = async (
  username: string,
): Promise<FriendActionResult> => {
  const session = await requireSession();

  if (!username.trim()) {
    return { ok: false, error: "Enter a username." };
  }

  const foundUser = await searchUser(username);
  if (!foundUser) {
    return { ok: false, error: `No user found with username "${username}".` };
  }

  const existing = await db
    .select()
    .from(friendship)
    .where(
      or(
        and(
          eq(friendship.requesterId, session.user.id),
          eq(friendship.addresseeId, foundUser.id),
        ),
        and(
          eq(friendship.requesterId, foundUser.id),
          eq(friendship.addresseeId, session.user.id),
        ),
      ),
    );

  if (existing.some((row) => row.status === "accepted")) {
    return { ok: false, error: "You are already friends." };
  }

  if (
    existing.some(
      (row) => row.status === "pending" && row.requesterId === session.user.id,
    )
  ) {
    return { ok: false, error: "You already sent a request to this user." };
  }

  if (
    existing.some(
      (row) => row.status === "pending" && row.addresseeId === session.user.id,
    )
  ) {
    return {
      ok: false,
      error: "This user already sent you a request. Accept it instead.",
    };
  }

  await db.insert(friendship).values({
    requesterId: session.user.id,
    addresseeId: foundUser.id,
    status: "pending",
  });

  return { ok: true };
};

export const respondToFriendRequest = async (
  requestId: number,
  action: "accept" | "decline",
): Promise<FriendActionResult> => {
  const session = await requireSession();

  const request = await db
    .select()
    .from(friendship)
    .where(eq(friendship.id, requestId))
    .limit(1);

  if (request.length === 0) {
    return { ok: false, error: "Request not found." };
  }

  const [requestRow] = request;

  if (requestRow.status !== "pending") {
    return { ok: false, error: "Request is not pending." };
  }

  if (requestRow.addresseeId !== session.user.id) {
    return { ok: false, error: "You cannot respond to this request." };
  }

  if (action === "decline") {
    await db.delete(friendship).where(eq(friendship.id, requestId));
    return { ok: true };
  }

  await db.delete(friendship).where(eq(friendship.id, requestId));
  await db.insert(friendship).values([
    {
      requesterId: requestRow.requesterId,
      addresseeId: requestRow.addresseeId,
      status: "accepted",
    },
    {
      requesterId: requestRow.addresseeId,
      addresseeId: requestRow.requesterId,
      status: "accepted",
    },
  ]);

  return { ok: true };
};

export const cancelOutgoingRequest = async (
  requestId: number,
): Promise<FriendActionResult> => {
  const session = await requireSession();

  const request = await db
    .select()
    .from(friendship)
    .where(eq(friendship.id, requestId))
    .limit(1);

  if (request.length === 0) {
    return { ok: false, error: "Request not found." };
  }

  const [requestRow] = request;

  if (requestRow.status !== "pending") {
    return { ok: false, error: "Request is not pending." };
  }

  if (requestRow.requesterId !== session.user.id) {
    return { ok: false, error: "You are not the requester." };
  }

  await db
    .delete(friendship)
    .where(
      and(
        eq(friendship.id, requestId),
        eq(friendship.requesterId, session.user.id),
        eq(friendship.status, "pending"),
      ),
    );

  return { ok: true };
};

export const removeFriend = async (
  userId: string,
): Promise<FriendActionResult> => {
  const session = await requireSession();

  const existing = await db
    .select()
    .from(friendship)
    .where(
      and(
        eq(friendship.requesterId, session.user.id),
        eq(friendship.addresseeId, userId),
        eq(friendship.status, "accepted"),
      ),
    )
    .limit(1);

  if (existing.length === 0) {
    return { ok: false, error: "Friend not found." };
  }

  await db
    .delete(friendship)
    .where(
      or(
        and(
          eq(friendship.requesterId, session.user.id),
          eq(friendship.addresseeId, userId),
          eq(friendship.status, "accepted"),
        ),
        and(
          eq(friendship.requesterId, userId),
          eq(friendship.addresseeId, session.user.id),
          eq(friendship.status, "accepted"),
        ),
      ),
    );

  return { ok: true };
};
