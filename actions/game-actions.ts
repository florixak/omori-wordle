"use server";

import { MAX_ATTEMPTS } from "@/constants";
import { getDailyWord, isValidGuess } from "@/lib/daily-word";
import { evaluateGuess, getGameStatus } from "@/lib/game-logic";
import { GameStatus, GuessResult } from "@/types/game-types";

export type ProcessGuessResult =
  | { ok: true; result: GuessResult; status: GameStatus }
  | { ok: false; error: string };

export async function processGuess(
  guess: string,
  previousGuesses: string[],
): Promise<ProcessGuessResult> {
  const upper = guess.toUpperCase();

  if (!isValidGuess(upper)) {
    return { ok: false, error: "Not in word list" };
  }

  const answer = getDailyWord();
  const allGuesses = [...previousGuesses, upper];
  const result = evaluateGuess(upper, answer);
  const status = getGameStatus(allGuesses, answer, MAX_ATTEMPTS);

  return { ok: true, result, status };
}
