import { getFriendsOverview } from "@/actions/friends-actions";
import { getFriendsLeaderboard } from "@/actions/leaderboard-actions";
import { getStats } from "@/actions/stats-actions";
import { QUERY_KEYS } from "@/constants";

export const createFriendsOverviewQueryOptions = (
  userId: string | undefined,
  open: boolean,
) => {
  return {
    queryKey: [...QUERY_KEYS.FRIENDS_OVERVIEW, userId] as const,
    queryFn: () => getFriendsOverview(),
    enabled: Boolean(userId) && open,
  };
};

export const createFriendsLeaderboardQueryOptions = (
  userId: string | undefined,
  open: boolean,
) => {
  return {
    queryKey: [...QUERY_KEYS.FRIENDS_LEADERBOARD, userId] as const,
    queryFn: () => getFriendsLeaderboard(),
    enabled: Boolean(userId) && open,
  };
};

export const createStatsQueryOptions = (
  targetUserId: string | undefined,
  open: boolean,
  isAuthenticated: boolean,
) => {
  return {
    queryKey: [...QUERY_KEYS.STATS(targetUserId ?? "")] as const,
    queryFn: () => getStats(targetUserId ?? ""),
    enabled: isAuthenticated && Boolean(targetUserId) && open,
  };
};
