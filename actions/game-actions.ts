"use server";

import { MAX_ATTEMPTS } from "@/constants";
import { getDailyWord, isValidGuess } from "@/lib/daily-word";
import {
  processGuessSubmission,
  type ProcessGuessResult,
} from "@/lib/guess-submission";

export type { ProcessGuessResult };

export async function processGuess(
  guess: string,
  previousGuesses: string[],
  date?: string,
  previousSignature?: string,
): Promise<ProcessGuessResult> {
  return processGuessSubmission(
    guess,
    previousGuesses,
    getDailyWord(),
    MAX_ATTEMPTS,
    isValidGuess,
    date,
    previousSignature,
  );
}
