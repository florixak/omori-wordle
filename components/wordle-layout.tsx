"use client";

import useGameState from "@/hooks/use-game-state";
import { useRegisterGameActions } from "@/components/game-actions-provider";
import { useMemo, useRef } from "react";
import WordleGrid from "./wordle-grid";
import WordleKeyboard from "./wordle-keyboard";

type WordleLayoutProps = {
  date: string;
  wordLength: number;
};

const WordleLayout = ({ date, wordLength }: WordleLayoutProps) => {
  const {
    state,
    gridRows,
    error,
    keyboardState,
    addLetter,
    removeLetter,
    submitGuess,
    requestHint,
    isSubmitting,
  } = useGameState({
    date,
    wordLength,
  });

  const gameActions = useMemo(
    () => ({
      hintUsed: state.hintUsed,
      hint: state.hint,
      status: state.status,
      requestHint: requestHint,
    }),
    [state.hintUsed, state.hint, state.status],
  );

  useRegisterGameActions(gameActions);

  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 sm:gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl">
          Omori Wordle
        </h1>
        <p className="font-pixel text-xs sm:text-sm">Days in HEADSPACE: 0</p>
      </div>
      <WordleGrid gridRows={gridRows} error={error} wordLength={wordLength} />
      <WordleKeyboard
        keyboardState={keyboardState}
        addLetter={addLetter}
        removeLetter={removeLetter}
        submitGuess={submitGuess}
        status={state.status}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default WordleLayout;
