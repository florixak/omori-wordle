"use client";

import { RESULT_DIALOG_DELAY_MS } from "@/constants";
import { GameState } from "@/types/game-types";
import { useEffect, useRef, useState } from "react";

const isGameComplete = (status: GameState["status"]): boolean =>
  status === "won" || status === "lost";

export const useResultDialog = (
  state: GameState,
  options?: { blocked?: boolean },
) => {
  const blocked = options?.blocked ?? false;
  const [open, setOpen] = useState(false);
  const previousStatusRef = useRef(state.status);
  const hasRevealData =
    state.revealedWord !== null && state.answerHint !== null;

  useEffect(() => {
    if (blocked) {
      return;
    }

    if (!isGameComplete(state.status) || !hasRevealData) {
      previousStatusRef.current = state.status;
      return;
    }

    const justFinished = previousStatusRef.current === "playing";
    previousStatusRef.current = state.status;

    if (justFinished) {
      const timer = window.setTimeout(() => {
        setOpen(true);
      }, RESULT_DIALOG_DELAY_MS);

      return () => {
        window.clearTimeout(timer);
      };
    }

    setOpen(true);
  }, [state.status, hasRevealData, state.revealedWord, state.answerHint, blocked]);

  return {
    open,
    setOpen,
    canShow: isGameComplete(state.status) && hasRevealData,
  };
};
