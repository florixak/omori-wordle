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

export type FriendsOverview = {
  date: string;
  pendingRequests: PendingFriendRequest[];
  friends: FriendListEntry[];
  leaderboard: FriendsLeaderboardEntry[];
};

export type FriendActionResult = { ok: true } | { ok: false; error: string };
