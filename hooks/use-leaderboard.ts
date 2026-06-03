"use client";

import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { createFriendsLeaderboardQueryOptions } from "./query-options";

type UseLeaderboardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const useLeaderboard = ({ open, onOpenChange }: UseLeaderboardProps) => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const {
    data: leaderboard,
    isPending: isLeaderboardPending,
    error,
    refetch,
  } = useQuery(createFriendsLeaderboardQueryOptions(session?.user.id, open));

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  return {
    session,
    isSessionPending,
    handleOpenChange,
    handleLogin,
    isLeaderboardPending,
    error,
    leaderboard,
    refetch,
  };
};

export default useLeaderboard;
