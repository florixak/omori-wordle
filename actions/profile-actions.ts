"use server";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { getAvatar } from "@/lib/friend-utils";
import { eq } from "drizzle-orm";
import { requireSession } from "@/actions/friends-actions";

export const updateAvatar = async (avatarId: string): Promise<string> => {
  const session = await requireSession();

  const existing = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (existing.length === 0) {
    throw new Error("User not found");
  }

  const avatar = getAvatar(avatarId);

  if (!avatar) {
    throw new Error("Avatar not found");
  }

  await db
    .update(user)
    .set({
      image: avatar.image,
    })
    .where(eq(user.id, session.user.id));

  return avatarId;
};
