"use client";

import { useRegisterRequestHint } from "@/components/game-actions-provider";
import useGameState from "@/hooks/use-game-state";
import WordleGrid from "./wordle-grid";
import WordleKeyboard from "./wordle-keyboard";
import WordleTitle from "./wordle-title";

type WordleLayoutProps = {
  date: string;
  wordLength: number;
  streak: number;
  isLoggedIn: boolean;
};

const WordleLayout = ({
  date,
  wordLength,
  streak,
  isLoggedIn,
}: WordleLayoutProps) => {
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

  useRegisterRequestHint(requestHint);

  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 sm:gap-6">
      <WordleTitle streak={streak} isLoggedIn={isLoggedIn} />
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
