import { evaluateGuess, getGameStatus } from "@/lib/game-logic";
import { GameStatus, TileEvaluation } from "@/types/game-types";
import { createHmac, timingSafeEqual } from "crypto";

const signHistory = (date: string, guesses: string[]): string => {
  const secret = process.env.GAME_HISTORY_SECRET;
  if (!secret) throw new Error("Missing GAME_HISTORY_SECRET");

  return createHmac("sha256", secret)
    .update(JSON.stringify({ date, guesses }))
    .digest("hex");
};

const isHistorySigned = (
  date: string,
  guesses: string[],
  signature?: string,
): boolean => {
  // If no signature provided, only accept empty histories.
  if (!signature) return guesses.length === 0;
  const expected = signHistory(date, guesses);
  if (expected.length !== signature.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

export type ProcessGuessResult =
  | {
      ok: true;
      evaluations: TileEvaluation[];
      status: GameStatus;
      guess: string;
      signature?: string;
    }
  | { ok: false; error: string };

export const processGuessSubmission = (
  guess: string,
  previousGuesses: string[],
  answer: string,
  maxAttempts: number,
  isGuessValid: (word: string) => boolean,
  date?: string,
  previousSignature?: string,
): ProcessGuessResult => {
  if (previousGuesses.length > 0) {
    if (!date || !previousSignature) {
      return { ok: false, error: "Invalid game state" };
    }
    if (!isHistorySigned(date, previousGuesses, previousSignature)) {
      return { ok: false, error: "Invalid game state" };
    }
  }

  if (
    previousGuesses.length > 0 &&
    (!date ||
      !previousSignature ||
      !isHistorySigned(date, previousGuesses, previousSignature))
  ) {
    return { ok: false, error: "Invalid game state" };
  }

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
  const evaluations = evaluateGuess(upper, answer);
  const status = getGameStatus(allGuesses, answer, maxAttempts);

  let newSignature: string | undefined;
  try {
    if (date && process.env.GAME_HISTORY_SECRET) {
      newSignature = signHistory(date, allGuesses);
    }
  } catch {
    newSignature = undefined;
  }

  return {
    ok: true,
    evaluations,
    status,
    guess: upper,
    signature: newSignature,
  };
};
