"use client";

import { useGameHintState } from "@/hooks/use-game-hint-state";
import { useState } from "react";
import { useGameActions } from "./game-actions-provider";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "./omori/omori-dialog";
import WordleButton from "./wordle-button";

type HintDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const HintDialog = ({ open, onOpenChange }: HintDialogProps) => {
  const gameActions = useGameActions();
  const { hintUsed, hint } = useGameHintState();
  const [isHintLoading, setIsHintLoading] = useState(false);
  const isRevealed = hintUsed && hint !== null;

  const handleRevealHint = async () => {
    if (!gameActions) {
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

  return (
    <OmoriDialog open={open} onOpenChange={onOpenChange}>
      <OmoriDialogContent>
        <OmoriDialogHeader>
          <OmoriDialogTitle>Hint</OmoriDialogTitle>
          <OmoriDialogDescription>
            {isRevealed ? hint : "Need a nudge? You get one hint per puzzle."}
          </OmoriDialogDescription>
        </OmoriDialogHeader>
        <OmoriDialogFooter>
          {!isRevealed ? (
            <WordleButton
              className="w-full gap-2"
              onClick={handleRevealHint}
              disabled={isHintLoading}
            >
              {isHintLoading ? "Loading…" : "Reveal hint"}
            </WordleButton>
          ) : (
            <WordleButton
              className="w-full gap-2"
              onClick={() => onOpenChange(false)}
            >
              Got it!
            </WordleButton>
          )}
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default HintDialog;
