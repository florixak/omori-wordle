"use client";

import {
  applyKeepsake,
  declineKeepsake,
  getPendingKeepsakeOffer,
} from "@/actions/game-actions";
import KeepsakeDialog from "@/components/dialog/keepsake-dialog";
import { invalidateUserStats } from "@/hooks/query-options";
import { authClient } from "@/lib/auth-client";
import { ErrorCode, getErrorMessage } from "@/lib/errors";
import { omoriToast } from "@/lib/omori-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type KeepsakeOutcome = "used" | "declined" | "reset";

type UseKeepsakeDialogOptions = {
  onResolved?: (outcome: KeepsakeOutcome) => void;
  checkPendingOnMount?: boolean;
};

export const useKeepsakeDialog = ({
  onResolved,
  checkPendingOnMount = false,
}: UseKeepsakeDialogOptions = {}) => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingFetchDone, setPendingFetchDone] = useState(false);

  useEffect(() => {
    if (!checkPendingOnMount || isSessionPending || !session) {
      return;
    }

    let cancelled = false;

    void getPendingKeepsakeOffer()
      .then((result) => {
        if (cancelled) {
          return;
        }

        if (result?.pending) {
          setOpen(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPendingFetchDone(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [checkPendingOnMount, isSessionPending, session]);

  const pendingCheckDone =
    !checkPendingOnMount ||
    (!isSessionPending && (!session || pendingFetchDone));

  const refreshStreak = () => {
    if (session) {
      invalidateUserStats(queryClient, session.user.id);
    }

    router.refresh();
  };

  const applyMutation = useMutation({
    mutationFn: async () => {
      const result = await applyKeepsake();
      if (!result.ok) {
        throw new Error(getErrorMessage(result.error));
      }
    },
    onSuccess: () => {
      refreshStreak();
      setOpen(false);
      omoriToast.success("Your Keepsake fades, but your streak remains.");
      onResolved?.("used");
    },
    onError: (error: Error) => {
      omoriToast.error(
        error.message || getErrorMessage(ErrorCode.UNKNOWN_ERROR),
      );
    },
  });

  const declineMutation = useMutation({
    mutationFn: async () => {
      const result = await declineKeepsake();
      if (!result.ok) {
        throw new Error(getErrorMessage(result.error));
      }
    },
    onSuccess: () => {
      refreshStreak();
      setOpen(false);
      omoriToast.info("This memory slips away... Day 1 begins again.");
      onResolved?.("declined");
    },
    onError: (error: Error) => {
      omoriToast.error(
        error.message || getErrorMessage(ErrorCode.UNKNOWN_ERROR),
      );
    },
  });

  const isLoading = applyMutation.isPending || declineMutation.isPending;

  const handleSubmitResult = (result: {
    keepsakeOffer?: true;
    streakReset?: true;
  }) => {
    if (result.keepsakeOffer) {
      setOpen(true);
      return;
    }

    if (result.streakReset) {
      omoriToast.info("This memory slips away... Day 1 begins again.");
      refreshStreak();
      onResolved?.("reset");
    }
  };

  const dialog = (
    <KeepsakeDialog
      open={open}
      onUseKeepsake={() => applyMutation.mutate()}
      onDecline={() => declineMutation.mutate()}
      isLoading={isLoading}
    />
  );

  return {
    dialog,
    handleSubmitResult,
    isKeepsakeOpen: open,
    pendingCheckDone,
  };
};
