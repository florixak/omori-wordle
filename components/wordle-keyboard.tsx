"use client";

import { KEYBOARD_LAYOUT } from "@/constants";
import { GameStatus, TileEvaluation } from "@/types/game-types";
import WordleButton from "./wordle-button";

type WordleKeyboardProps = {
  keyboardState: Record<string, TileEvaluation>;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => Promise<void>;
  status: GameStatus;
  isSubmitting: boolean;
};

const WordleKeyboard = ({
  keyboardState,
  addLetter,
  removeLetter,
  submitGuess,
  status,
  isSubmitting,
}: WordleKeyboardProps) => {
  const isGameOver = status === "won" || status === "lost";
  const isLocked = isGameOver || isSubmitting;

  const handleAddLetter = (letter: string) => {
    if (isLocked) return;
    addLetter(letter);
  };

  const handleRemoveLetter = () => {
    if (isLocked) return;
    removeLetter();
  };

  const handleSubmitGuess = () => {
    if (isLocked) return;
    void submitGuess();
  };

  return (
    <div className="flex w-full flex-col gap-1.5 sm:gap-2">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => {
        const isBottomRow = rowIndex === KEYBOARD_LAYOUT.length - 1;

        return (
          <div
            key={rowIndex}
            className="flex w-full justify-center gap-1 sm:gap-1.5"
            style={{
              paddingInline: rowIndex === 1 ? "0.75rem" : undefined,
            }}
          >
            {isBottomRow ? (
              <>
                <WordleButton
                  onClick={handleSubmitGuess}
                  disabled={isLocked}
                  className="action-button"
                >
                  ENTER
                </WordleButton>
                {row.map((letter) => (
                  <WordleButton
                    key={letter}
                    onClick={() => handleAddLetter(letter)}
                    disabled={isLocked || keyboardState[letter] === "absent"}
                    className="letter-button"
                  >
                    {letter}
                  </WordleButton>
                ))}
                <WordleButton
                  onClick={handleRemoveLetter}
                  disabled={isLocked}
                  className="action-button"
                >
                  ⌫
                </WordleButton>
              </>
            ) : (
              row.map((letter) => (
                <WordleButton
                  key={letter}
                  onClick={() => handleAddLetter(letter)}
                  disabled={isLocked || keyboardState[letter] === "absent"}
                  className="letter-button"
                >
                  {letter}
                </WordleButton>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WordleKeyboard;
