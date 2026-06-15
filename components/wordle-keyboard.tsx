"use client";

import { ALLOWED_KEYS, KEYBOARD_LAYOUT } from "@/constants";
import { cn } from "@/lib/utils";
import {
  GameStatus,
  TileDisplayState,
  TileEvaluation,
} from "@/types/game-types";
import { RegisterableHotkey, useHotkeys } from "@tanstack/react-hotkeys";
import OmoriButton from "./omori/omori-button";

type WordleKeyboardProps = {
  keyboardState: Record<string, TileEvaluation>;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => Promise<void>;
  status: GameStatus;
  isSubmitting: boolean;
};

const getKeyClasses = (display: TileDisplayState) => {
  switch (display) {
    case "correct":
      return "bg-[var(--omori-correct)] text-black";
    case "present":
      return "bg-[var(--omori-present)] text-black";
    case "absent":
      return "bg-[var(--omori-absent)] text-white";
    default:
      return undefined;
  }
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

  useHotkeys(
    ALLOWED_KEYS.map((key) => ({
      hotkey: key as RegisterableHotkey,
      callback: () => {
        if (key === "Enter") void submitGuess();
        else if (key === "Backspace") removeLetter();
        else addLetter(key);
      },
      options: {
        preventDefault: key === "Backspace" || key === "Enter",
      },
    })),
    {
      enabled: !isLocked,
      ignoreInputs: true,
    },
  );

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
                <OmoriButton
                  onClick={handleSubmitGuess}
                  disabled={isLocked}
                  className="min-w-0 px-0.5 sm:px-1"
                  tabIndex={-1}
                  onPointerDown={(e) => e.preventDefault()}
                >
                  ENTER
                </OmoriButton>
                {row.map((letter) => (
                  <OmoriButton
                    key={letter}
                    onClick={() => handleAddLetter(letter)}
                    disabled={isLocked}
                    className={cn(
                      "min-w-0 flex-1",
                      getKeyClasses(keyboardState[letter]),
                    )}
                    tabIndex={-1}
                    onPointerDown={(e) => e.preventDefault()}
                  >
                    {letter}
                  </OmoriButton>
                ))}
                <OmoriButton
                  onClick={handleRemoveLetter}
                  disabled={isLocked}
                  className="min-w-7 sm:min-w-0 px-0.5 flex-1 sm:px-1"
                  tabIndex={-1}
                  onPointerDown={(e) => e.preventDefault()}
                >
                  ⌫
                </OmoriButton>
              </>
            ) : (
              row.map((letter) => (
                <OmoriButton
                  key={letter}
                  onClick={() => handleAddLetter(letter)}
                  disabled={isLocked}
                  className={cn(
                    "min-w-0 flex-1",
                    getKeyClasses(keyboardState[letter]),
                  )}
                  tabIndex={-1}
                  onPointerDown={(e) => e.preventDefault()}
                >
                  {letter}
                </OmoriButton>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WordleKeyboard;
