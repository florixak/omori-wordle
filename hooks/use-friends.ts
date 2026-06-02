"use client";

import {
  getFriendsOverview,
  sendFriendRequest,
} from "@/actions/friends-actions";
import { authClient } from "@/lib/auth-client";
import {
  FriendListEntry,
  FriendsLeaderboardEntry,
  FriendsOverview,
  PendingFriendRequest,
} from "@/types/friends-types";
import { useEffect, useEffectEvent, useState } from "react";

type UseFriendsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const useFriends = ({ open, onOpenChange }: UseFriendsProps) => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [friends, setFriends] = useState<FriendListEntry[]>([]);
  const [pendingRequests, setPendingRequests] = useState<
    PendingFriendRequest[]
  >([]);
  const [leaderboard, setLeaderboard] = useState<FriendsLeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isActionBusy, setIsActionBusy] = useState(false);
  const [overview, setOverview] = useState<FriendsOverview | null>(null);

  const setLoadingEvent = useEffectEvent((loading: boolean) => {
    setIsLoading(loading);
  });

  const setErrorEvent = useEffectEvent((nextError: string | null) => {
    setError(nextError);
  });

  const setOverviewEvent = useEffectEvent(
    (nextOverview: FriendsOverview | null) => {
      setOverview(nextOverview);
    },
  );

  const reloadOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setOverview(null);
      const nextOverview = await getFriendsOverview();
      setOverview(nextOverview);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load friends",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open || !session) {
      return;
    }

    const fetchOverview = async () => {
      try {
        setLoadingEvent(true);
        setErrorEvent(null);
        setOverviewEvent(null);
        const nextOverview = await getFriendsOverview();
        setOverviewEvent(nextOverview);
      } catch (fetchError) {
        setErrorEvent(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load friends",
        );
      } finally {
        setLoadingEvent(false);
      }
    };

    void fetchOverview();
  }, [open, session]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setActionMessage(null);
      setError(null);
      setOverview(null);
    }

    onOpenChange(nextOpen);
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  const runAction = async (
    action: () => Promise<{ ok: boolean; error?: string }>,
  ) => {
    setIsActionBusy(true);
    setActionMessage(null);

    try {
      const result = await action();
      if (!result.ok) {
        setActionMessage(result.error ?? "Something went wrong.");
        return;
      }

      await reloadOverview();
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleSendRequest = async (username: string) => {
    await runAction(() => sendFriendRequest(username));
  };

  return {
    session,
    isSessionPending,
    handleOpenChange,
    handleLogin,
    runAction,
    isLoading,
    error,
    overview,
    friends,
    pendingRequests,
    leaderboard,
    isActionBusy,
    actionMessage,
    reloadOverview,
    handleSendRequest,
  };
};

export default useFriends;
