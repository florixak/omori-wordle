"use client";

import { useRegisterRequestHint } from "@/components/providers/game-actions-provider";
import ResultDialog from "@/components/dialog/result-dialog";
import useGameState from "@/hooks/use-game-state";
import { useGameLostTheme } from "@/hooks/use-game-lost-theme";
import { useResultDialog } from "@/hooks/use-result-dialog";
import { getGuessWords } from "@/lib/game-state-utils";
import WordleGrid from "./wordle-grid";
import WordleKeyboard from "./wordle-keyboard";
import WordleTitle from "./wordle-title";

type WordleLayoutProps = {
  date: string;
  wordLength: number;
  dayNumber: number;
  streak: number;
  isLoggedIn: boolean;
};

const WordleLayout = ({
  date,
  wordLength,
  dayNumber,
  streak,
  isLoggedIn,
}: WordleLayoutProps) => {
  const {
    state,
    gridRows,
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

  const { open: showResultDialog, setOpen: setShowResultDialog } =
    useResultDialog(state);

  useRegisterRequestHint(requestHint);

  const guesses = getGuessWords(state.submittedGuesses);
  const isWon = state.status === "won";
  const isLost = state.status === "lost";

  useGameLostTheme(isLost);

  return (
    <div className="flex w-full max-w-lg flex-col items-center justify-center gap-4 sm:gap-6">
      <WordleTitle streak={streak} isLoggedIn={isLoggedIn} />
      <WordleGrid gridRows={gridRows} wordLength={wordLength} />
      <WordleKeyboard
        keyboardState={keyboardState}
        addLetter={addLetter}
        removeLetter={removeLetter}
        submitGuess={submitGuess}
        status={state.status}
        isSubmitting={isSubmitting}
      />
      {state.revealedWord && state.answerHint ? (
        <ResultDialog
          open={showResultDialog}
          onOpenChange={setShowResultDialog}
          word={state.revealedWord}
          hint={state.answerHint}
          guesses={isWon ? guesses.length : 0}
          isWon={isWon}
          dayNumber={dayNumber}
          submittedGuesses={state.submittedGuesses}
          hintUsed={state.hintUsed}
        />
      ) : null}
    </div>
  );
};

export default WordleLayout;
