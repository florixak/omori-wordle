import { getFriendsOverview } from "@/actions/friends-actions";
import { getFriendsLeaderboard } from "@/actions/leaderboard-actions";
import { getStats } from "@/actions/stats-actions";
import { QUERY_KEYS } from "@/constants";
import { QueryClient, queryOptions } from "@tanstack/react-query";

export const createFriendsOverviewQueryOptions = (
  userId: string | undefined,
  open: boolean,
) =>
  queryOptions({
    queryKey: [...QUERY_KEYS.FRIENDS_OVERVIEW, userId] as const,
    queryFn: () => getFriendsOverview(),
    enabled: Boolean(userId) && open,
    staleTime: 60 * 1000 * 15,
    gcTime: 60 * 1000 * 30,
  });

export const createFriendsLeaderboardQueryOptions = (
  userId: string | undefined,
  open: boolean,
) =>
  queryOptions({
    queryKey: [...QUERY_KEYS.FRIENDS_LEADERBOARD, userId] as const,
    queryFn: () => getFriendsLeaderboard(),
    enabled: Boolean(userId) && open,
    staleTime: 60 * 1000 * 5,
    gcTime: 60 * 1000 * 10,
  });

export const createStatsQueryOptions = (
  targetUserId: string | undefined,
  open: boolean,
  isAuthenticated: boolean,
) =>
  queryOptions({
    queryKey: [...QUERY_KEYS.STATS(targetUserId ?? "")] as const,
    queryFn: () => getStats(targetUserId ?? ""),
    enabled: isAuthenticated && Boolean(targetUserId) && open,
    staleTime: Infinity,
    gcTime: Infinity,
  });

export const invalidateUserStats = (
  queryClient: QueryClient,
  userId: string,
): void => {
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.STATS(userId),
  });
};
