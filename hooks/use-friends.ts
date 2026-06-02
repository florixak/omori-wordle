"use client";

import {
  cancelOutgoingRequest,
  removeFriend,
  respondToFriendRequest,
  sendFriendRequest,
} from "@/actions/friends-actions";
import { createFriendsOverviewQueryOptions } from "@/hooks/query-options";
import { authClient } from "@/lib/auth-client";
import { assertFriendActionResult } from "@/lib/friend-utils";
import { QUERY_KEYS } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type UseFriendsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const useFriends = ({ open, onOpenChange }: UseFriendsProps) => {
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const userId = session?.user.id;

  const {
    data: overview,
    isPending: isOverviewPending,
    isFetching: isOverviewFetching,
    error,
    refetch,
  } = useQuery(createFriendsOverviewQueryOptions(userId, open));

  const invalidateOverview = () => {
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.FRIENDS_OVERVIEW,
    });
  };

  const mutationOptions = {
    onMutate: () => {
      setActionMessage(null);
    },
    onSuccess: () => {
      invalidateOverview();
    },
    onError: (mutationError: Error) => {
      setActionMessage(mutationError.message);
    },
  };

  const { mutate: sendRequest, isPending: isSendPending } = useMutation({
    mutationFn: async (username: string) => {
      const result = await sendFriendRequest(username);
      assertFriendActionResult(result);
    },
    ...mutationOptions,
  });

  const { mutate: respondToRequest, isPending: isRespondPending } =
    useMutation({
      mutationFn: async ({
        requestId,
        action,
      }: {
        requestId: number;
        action: "accept" | "decline";
      }) => {
        const result = await respondToFriendRequest(requestId, action);
        assertFriendActionResult(result);
      },
      ...mutationOptions,
    });

  const {
    mutate: cancelOutgoingRequestAction,
    isPending: isCancelPending,
  } = useMutation({
    mutationFn: async (requestId: number) => {
      const result = await cancelOutgoingRequest(requestId);
      assertFriendActionResult(result);
    },
    ...mutationOptions,
  });

  const { mutate: removeFriendAction, isPending: isRemovePending } =
    useMutation({
      mutationFn: async (friendUserId: string) => {
        const result = await removeFriend(friendUserId);
        assertFriendActionResult(result);
      },
      ...mutationOptions,
    });

  const isMutating =
    isSendPending ||
    isRespondPending ||
    isCancelPending ||
    isRemovePending;

  const isBusy = isOverviewFetching || isMutating;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setActionMessage(null);
    }

    onOpenChange(nextOpen);
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  const handleSendRequest = (username: string) => {
    sendRequest(username);
  };

  const handleRespondToRequest = (
    requestId: number,
    action: "accept" | "decline",
  ) => {
    respondToRequest({ requestId, action });
  };

  const handleCancelOutgoingRequest = (requestId: number) => {
    cancelOutgoingRequestAction(requestId);
  };

  const handleRemoveFriend = (friendUserId: string) => {
    removeFriendAction(friendUserId);
  };

  return {
    session,
    isSessionPending,
    handleOpenChange,
    handleLogin,
    isOverviewPending,
    isBusy,
    error,
    overview,
    actionMessage,
    handleSendRequest,
    handleRespondToRequest,
    handleCancelOutgoingRequest,
    handleRemoveFriend,
    refetch,
  };
};

export default useFriends;
