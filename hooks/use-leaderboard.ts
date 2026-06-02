"use client";

import { getFriendsLeaderboard } from "@/actions/leaderboard-actions";
import { authClient } from "@/lib/auth-client";
import type { FriendsLeaderboard } from "@/types/friends-types";
import { useEffect, useEffectEvent, useState } from "react";

type UseLeaderboardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const useLeaderboard = ({ open, onOpenChange }: UseLeaderboardProps) => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [leaderboard, setLeaderboard] = useState<FriendsLeaderboard | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLoadingEvent = useEffectEvent((loading: boolean) => {
    setIsLoading(loading);
  });

  const setErrorEvent = useEffectEvent((nextError: string | null) => {
    setError(nextError);
  });

  const setLeaderboardEvent = useEffectEvent(
    (nextLeaderboard: FriendsLeaderboard | null) => {
      setLeaderboard(nextLeaderboard);
    },
  );

  const reloadLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLeaderboard(null);
      const nextLeaderboard = await getFriendsLeaderboard();
      setLeaderboard(nextLeaderboard);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load leaderboard",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !session) {
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        setLoadingEvent(true);
        setErrorEvent(null);
        setLeaderboardEvent(null);
        const nextLeaderboard = await getFriendsLeaderboard();
        setLeaderboardEvent(nextLeaderboard);
      } catch (fetchError) {
        setErrorEvent(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load leaderboard",
        );
      } finally {
        setLoadingEvent(false);
      }
    };

    void fetchLeaderboard();
  }, [open, session]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setError(null);
      setLeaderboard(null);
    }

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
    isLoading,
    error,
    leaderboard,
    reloadLeaderboard,
  };
};

export default useLeaderboard;
