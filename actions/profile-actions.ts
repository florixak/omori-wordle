"use server";

import { requireSession } from "@/actions/friends-actions";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { getAvatarById } from "@/lib/friend-utils";
import { AppError, ErrorCode } from "@/lib/errors";
import { APIError } from "better-auth/api";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export const updateAvatar = async (avatarId: string): Promise<string> => {
  const session = await requireSession();

  const existing = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (existing.length === 0) {
    throw new AppError(ErrorCode.USER_NOT_FOUND);
  }

  const avatar = getAvatarById(avatarId);

  if (!avatar) {
    throw new AppError(ErrorCode.AVATAR_NOT_FOUND);
  }

  await db
    .update(user)
    .set({
      image: avatar.image,
    })
    .where(eq(user.id, session.user.id));

  return avatarId;
};

export const deleteAccount = async (): Promise<void> => {
  await requireSession();

  try {
    const result = await auth.api.deleteUser({
      headers: await headers(),
      body: {},
    });

    if (!result.success) {
      throw new AppError(ErrorCode.DELETE_ACCOUNT_FAILED);
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof APIError && error.status === 400) {
      throw new AppError(ErrorCode.DELETE_ACCOUNT_SESSION_EXPIRED);
    }

    throw new AppError(ErrorCode.DELETE_ACCOUNT_FAILED);
  }
};
