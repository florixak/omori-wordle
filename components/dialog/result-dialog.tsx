"use client";

import { MAX_ATTEMPTS } from "@/constants";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "@/components/omori/omori-dialog";
import WordleButton from "@/components/wordle-button";
import { cn } from "@/lib/utils";

type ResultDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: string;
  hint: string;
  guesses: number;
  isWon: boolean;
};

const ResultDialog = ({
  open,
  onOpenChange,
  word,
  hint,
  guesses,
  isWon,
}: ResultDialogProps) => {
  return (
    <OmoriDialog open={open} onOpenChange={onOpenChange}>
      <OmoriDialogContent>
        <OmoriDialogHeader>
          <OmoriDialogTitle className="text-xl sm:text-2xl">
            {isWon ? "You remember" : "Something forgotten..."}
          </OmoriDialogTitle>
          <OmoriDialogDescription className="text-base sm:text-lg text-foreground">
            The word was: {word}
          </OmoriDialogDescription>
        </OmoriDialogHeader>
        <p className="text-sm sm:text-base">
          {isWon
            ? `Guesses: ${guesses || 0}/${MAX_ATTEMPTS}`
            : "SOMETHING is still watching..."}
        </p>
        <div className="omori-border bg-background p-4">
          <span className="text-sm sm:text-base">{hint}</span>{" "}
        </div>
        <OmoriDialogFooter>
          <WordleButton
            className={cn("w-full gap-2", "omori-button-default")}
            onClick={() => onOpenChange(false)}
          >
            Share result
          </WordleButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default ResultDialog;
