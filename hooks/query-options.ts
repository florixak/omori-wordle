import { getFriendsOverview } from "@/actions/friends-actions";
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
