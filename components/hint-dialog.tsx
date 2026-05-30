"use client";

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
  hint: string | null;
  hintUsed: boolean;
  onRevealHint: () => Promise<void>;
  isLoading?: boolean;
};

const HintDialog = ({
  open,
  onOpenChange,
  hint,
  hintUsed,
  onRevealHint,
  isLoading = false,
}: HintDialogProps) => {
  const isRevealed = hintUsed && hint !== null;

  const handleRevealHint = () => {
    void onRevealHint();
  };

  return (
    <OmoriDialog open={open} onOpenChange={onOpenChange}>
      <OmoriDialogContent>
        <OmoriDialogHeader>
          <OmoriDialogTitle>Hint</OmoriDialogTitle>
          <OmoriDialogDescription>
            {isRevealed
              ? hint
              : "Need a nudge? You get one hint per puzzle."}
          </OmoriDialogDescription>
        </OmoriDialogHeader>
        <OmoriDialogFooter>
          {!isRevealed ? (
            <WordleButton
              className="w-full gap-2"
              onClick={handleRevealHint}
              disabled={isLoading}
            >
              {isLoading ? "Loading…" : "Reveal hint"}
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
