import { Avatar, AVATARS, DEFAULT_AVATAR } from "@/constants";
import { type User } from "@/db/schema";
import {
  FriendsLeaderboardEntry,
  FriendActionResult,
  FriendUserPreview,
} from "@/types/friends-types";

export const formatAttempts = (
  attempts: number | null,
  won: boolean,
): string => {
  if (attempts === null) {
    return "—";
  }

  if (!won) {
    return "X";
  }

  return String(attempts);
};

export const getAvatarSrc = (image: string | null): string =>
  image && image.trim().length > 0 ? image : DEFAULT_AVATAR;

export const getAvatarById = (id: string | null): Avatar | undefined => {
  if (!id) {
    return undefined;
  }

  return AVATARS.find((avatar) => avatar.id === id);
};

export const getAvatarByImage = (image: string | null): Avatar | undefined => {
  if (!image) {
    return undefined;
  }

  return AVATARS.find((avatar) => avatar.image === image);
};

export const assertFriendActionResult = (result: FriendActionResult): void => {
  if (!result.ok) {
    throw new Error(result.error);
  }
};

export const toUserPreview = (row: User): FriendUserPreview => ({
  id: row.id,
  name: row.name,
  username: row.name,
  image: row.image ?? null,
});

export const rankLeaderboard = (
  results: { userId: string; attempts: number; won: boolean }[],
  getPreview: (id: string) => FriendUserPreview,
): FriendsLeaderboardEntry[] => {
  const sorted = [...results].sort((a, b) => {
    if (a.won !== b.won) {
      return a.won ? -1 : 1;
    }

    if (a.won && b.won) {
      return a.attempts - b.attempts;
    }

    return 0;
  });

  return sorted.map((result, index) => ({
    user: getPreview(result.userId),
    attempts: result.attempts,
    won: result.won,
    rank: index + 1,
  }));
};
