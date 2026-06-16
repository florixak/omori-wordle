import { GridTile, SubmittedGuess } from "@/types/game-types";

export const submittedGuessesToGridRows = (
  submittedGuesses: SubmittedGuess[],
): GridTile[][] =>
  submittedGuesses.map((guess) =>
    guess.word.split("").map((letter, index) => ({
      letter,
      display: guess.evaluations[index],
    })),
  );

export const buildGridRows = (
  submittedGuesses: SubmittedGuess[],
  currentInput: string,
  wordLength: number,
  maxAttempts: number,
): GridTile[][] =>
  Array.from({ length: maxAttempts }, (_, rowIndex) => {
    const guess = submittedGuesses[rowIndex];

    if (guess) {
      return guess.word.split("").map((letter, index) => ({
        letter,
        display: guess.evaluations[index],
      }));
    }

    if (rowIndex === submittedGuesses.length) {
      return Array.from({ length: wordLength }, (_, index) => {
        const letter = currentInput[index] ?? "";

        return {
          letter,
          display: letter ? "active" : "empty",
        };
      });
    }

    return Array.from({ length: wordLength }, () => ({
      letter: "",
      display: "empty" as const,
    }));
  });
