"use client";

import { MIN_ATTEMPTS_FOR_HINT } from "@/constants";
import { useGameHintState } from "@/hooks/use-game-hint-state";
import { useState } from "react";
import { useGameActions } from "@/components/providers/game-actions-provider";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "@/components/omori/omori-dialog";
import OmoriButton from "@/components/omori/omori-button";

type HintDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const HintDialog = ({ open, onOpenChange }: HintDialogProps) => {
  const gameActions = useGameActions();
  const { hintUsed, hint, submittedGuessCount } = useGameHintState();
  const [isHintLoading, setIsHintLoading] = useState(false);
  const isRevealed = hintUsed && hint !== null;
  const guessesRemaining = MIN_ATTEMPTS_FOR_HINT - submittedGuessCount;
  const canRequestHint = submittedGuessCount >= MIN_ATTEMPTS_FOR_HINT;

  const handleRevealHint = async () => {
    if (!gameActions || !canRequestHint) {
      return;
    }

    setIsHintLoading(true);
    try {
      await gameActions.requestHint();
    } catch {
      // optionally surface a user-facing error state here
    } finally {
      setIsHintLoading(false);
    }
  };

  const guessLabel = guessesRemaining === 1 ? "guess" : "guesses";
  const getDescription = () => {
    if (isRevealed) {
      return hint;
    }

    if (!canRequestHint) {
      return `Make ${guessesRemaining} more ${guessLabel} before you can unlock a hint.`;
    }

    return "Need a nudge? You get one hint per puzzle.";
  };

  return (
    <OmoriDialog open={open} onOpenChange={onOpenChange}>
      <OmoriDialogContent>
        <OmoriDialogHeader>
          <OmoriDialogTitle>Hint</OmoriDialogTitle>
          <OmoriDialogDescription>{getDescription()}</OmoriDialogDescription>
        </OmoriDialogHeader>
        <OmoriDialogFooter>
          {!isRevealed ? (
            <OmoriButton
              className="w-full gap-2"
              onClick={handleRevealHint}
              disabled={isHintLoading || !canRequestHint || !gameActions}
            >
              {isHintLoading
                ? "Loading…"
                : !canRequestHint
                  ? `${guessesRemaining} ${guessLabel} left`
                  : "Reveal hint"}
            </OmoriButton>
          ) : (
            <OmoriButton
              className="w-full gap-2"
              onClick={() => onOpenChange(false)}
            >
              Got it!
            </OmoriButton>
          )}
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default HintDialog;
