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
import OmoriButton from "@/components/omori/omori-button";
import { submittedGuessesToGridRows } from "@/lib/grid-view";
import { omoriToast } from "@/lib/omori-toast";
import { generateShareText, shareGameResult } from "@/lib/share-result";
import { cn } from "@/lib/utils";
import { SubmittedGuess } from "@/types/game-types";
import { useState } from "react";

type ResultDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: string;
  hint: string;
  guesses: number;
  isWon: boolean;
  dayNumber: number;
  submittedGuesses: SubmittedGuess[];
  hintUsed: boolean;
};

const ResultDialog = ({
  open,
  onOpenChange,
  word,
  hint,
  guesses,
  isWon,
  dayNumber,
  submittedGuesses,
  hintUsed,
}: ResultDialogProps) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (isSharing) {
      return;
    }

    const shareText = generateShareText(
      dayNumber,
      guesses,
      submittedGuessesToGridRows(submittedGuesses),
      hintUsed,
    );

    setIsSharing(true);

    try {
      const method = await shareGameResult(shareText);

      if (method === "copied") {
        omoriToast.success("Copied to clipboard");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      omoriToast.error("Unable to share result");
    } finally {
      setIsSharing(false);
    }
  };

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
          <OmoriButton
            className={cn("w-full gap-2", "omori-button-default")}
            disabled={isSharing}
            onClick={() => void handleShare()}
          >
            {isSharing ? "Sharing..." : "Share result"}
          </OmoriButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default ResultDialog;
