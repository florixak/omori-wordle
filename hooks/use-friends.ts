"use client";

import {
  cancelOutgoingRequest,
  removeFriend,
  respondToFriendRequest,
  sendFriendRequest,
} from "@/actions/friends-actions";
import { QUERY_KEYS } from "@/constants";
import { createFriendsOverviewQueryOptions } from "@/hooks/query-options";
import { authClient } from "@/lib/auth-client";
import { assertFriendActionResult } from "@/lib/friend-utils";
import { omoriToast } from "@/lib/omori-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type UseFriendsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const useFriends = ({ open, onOpenChange }: UseFriendsProps) => {
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

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
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.FRIENDS_LEADERBOARD,
    });
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.FRIENDS_IS_FRIEND_KEY,
    });
    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.STATS_KEY,
    });
  };

  const createFriendMutationOptions = (successMessage: string) => ({
    onSuccess: () => {
      invalidateOverview();
      omoriToast.success(successMessage);
    },
    onError: (mutationError: Error) => {
      omoriToast.error(mutationError.message);
    },
  });

  const { mutate: sendRequest, isPending: isSendPending } = useMutation({
    mutationFn: async (username: string) => {
      const result = await sendFriendRequest(username);
      assertFriendActionResult(result);
    },
    ...createFriendMutationOptions("Request sent"),
  });

  const { mutate: respondToRequest, isPending: isRespondPending } = useMutation(
    {
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
      onSuccess: (_, { action }) => {
        invalidateOverview();
        omoriToast.success(
          action === "accept" ? "Friend added" : "Request declined",
        );
      },
      onError: (mutationError: Error) => {
        omoriToast.error(mutationError.message);
      },
    },
  );

  const { mutate: cancelOutgoingRequestAction, isPending: isCancelPending } =
    useMutation({
      mutationFn: async (requestId: number) => {
        const result = await cancelOutgoingRequest(requestId);
        assertFriendActionResult(result);
      },
      ...createFriendMutationOptions("Request cancelled"),
    });

  const { mutate: removeFriendAction, isPending: isRemovePending } =
    useMutation({
      mutationFn: async (friendUserId: string) => {
        const result = await removeFriend(friendUserId);
        assertFriendActionResult(result);
      },
      ...createFriendMutationOptions("Friend removed"),
    });

  const isMutating =
    isSendPending || isRespondPending || isCancelPending || isRemovePending;

  const isBusy = isOverviewFetching || isMutating;

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
    handleOpenChange: onOpenChange,
    handleLogin,
    isOverviewPending,
    isBusy,
    error,
    overview,
    handleSendRequest,
    handleRespondToRequest,
    handleCancelOutgoingRequest,
    handleRemoveFriend,
    refetch,
  };
};

export default useFriends;
