import { evaluateGuess, getGameStatus } from "@/lib/game-logic";
import { GameStatus, GuessResult } from "@/types/game-types";

export type ProcessGuessResult =
  | { ok: true; result: GuessResult; status: GameStatus; guess: string }
  | { ok: false; error: string };

export const processGuessSubmission = (
  guess: string,
  previousGuesses: string[],
  answer: string,
  maxAttempts: number,
  isGuessValid: (word: string) => boolean,
): ProcessGuessResult => {
  const upper = guess.toUpperCase();
  const normalizedPrevious = previousGuesses.map((priorGuess) =>
    priorGuess.toUpperCase(),
  );

  if (normalizedPrevious.length >= maxAttempts) {
    return { ok: false, error: "No attempts remaining" };
  }

  const priorStatus = getGameStatus(normalizedPrevious, answer, maxAttempts);
  if (priorStatus !== "playing") {
    return { ok: false, error: "Game already finished" };
  }

  for (const priorGuess of normalizedPrevious) {
    if (!isGuessValid(priorGuess)) {
      return { ok: false, error: "Invalid game state" };
    }
  }

  if (!isGuessValid(upper)) {
    return { ok: false, error: "Not in word list" };
  }

  const allGuesses = [...normalizedPrevious, upper];
  const result = evaluateGuess(upper, answer);
  const status = getGameStatus(allGuesses, answer, maxAttempts);

  return { ok: true, result, status, guess: upper };
};
