export type FriendUserPreview = {
  id: string;
  username: string | null;
  name: string;
  image: string | null;
};

export type PendingFriendRequest = {
  id: number;
  user: FriendUserPreview;
  direction: "incoming" | "outgoing";
};

export type FriendListEntry = {
  user: FriendUserPreview;
};

export type FriendsLeaderboardEntry = {
  user: FriendUserPreview;
  attempts: number | null;
  won: boolean;
  rank: number;
};

export type FriendsLeaderboard = {
  date: string;
  entries: FriendsLeaderboardEntry[];
};

export type FriendsOverview = {
  pendingRequests: PendingFriendRequest[];
  friends: FriendListEntry[];
};

import type { ErrorResult } from "@/lib/errors";

export type FriendActionResult = { ok: true } | ErrorResult;
