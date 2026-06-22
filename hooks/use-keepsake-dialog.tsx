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
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFetchDone, setPendingFetchDone] = useState(false);

  useEffect(() => {
    if (!checkPendingOnMount || isSessionPending || !session) {
      return;
    }

    let cancelled = false;

    void getPendingKeepsakeOffer().then((result) => {
      if (cancelled) {
        return;
      }

      if (result?.pending) {
        setOpen(true);
      }

      setPendingFetchDone(true);
    });

    return () => {
      cancelled = true;
    };
  }, [checkPendingOnMount, isSessionPending, session]);

  const pendingCheckDone =
    !checkPendingOnMount || isSessionPending || !session || pendingFetchDone;

  const showOffer = useCallback(() => {
    setOpen(true);
  }, []);

  const refreshStreak = useCallback(() => {
    if (session) {
      invalidateUserStats(queryClient, session.user.id);
    }

    router.refresh();
  }, [queryClient, router, session]);

  const showStreakResetMessage = useCallback(() => {
    omoriToast.info("This memory slips away... Day 1 begins again.");
    refreshStreak();
    onResolved?.("reset");
  }, [onResolved, refreshStreak]);

  const handleSubmitResult = useCallback(
    (result: { keepsakeOffer?: true; streakReset?: true }) => {
      if (result.keepsakeOffer) {
        showOffer();
        return;
      }

      if (result.streakReset) {
        showStreakResetMessage();
      }
    },
    [showOffer, showStreakResetMessage],
  );

  const handleUseKeepsake = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await applyKeepsake();

      if (!result.ok) {
        omoriToast.error(getErrorMessage(result.error));
        return;
      }

      refreshStreak();
      setOpen(false);
      omoriToast.success("Your Keepsake fades, but your streak remains.");
      onResolved?.("used");
    } catch {
      omoriToast.error(getErrorMessage(ErrorCode.UNKNOWN_ERROR));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await declineKeepsake();

      if (!result.ok) {
        omoriToast.error(getErrorMessage(result.error));
        return;
      }

      refreshStreak();
      setOpen(false);
      omoriToast.info("This memory slips away... Day 1 begins again.");
      onResolved?.("declined");
    } catch {
      omoriToast.error(getErrorMessage(ErrorCode.UNKNOWN_ERROR));
    } finally {
      setIsLoading(false);
    }
  };

  const dialog = (
    <KeepsakeDialog
      open={open}
      onUseKeepsake={() => void handleUseKeepsake()}
      onDecline={() => void handleDecline()}
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
