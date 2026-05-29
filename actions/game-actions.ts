"use server";

import { auth } from "@/auth";
import { MAX_ATTEMPTS } from "@/constants";
import { db } from "@/db/drizzle";
import { gameResult } from "@/db/schema";
import { getDailyDate, getDailyWord, isValidGuess } from "@/lib/daily-word";
import {
  ProcessGuessResult,
  processGuessSubmission,
} from "@/lib/guess-submission";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function processGuess(
  guess: string,
  previousGuesses: string[],
  date?: string,
  previousSignature?: string,
): Promise<ProcessGuessResult> {
  const today = getDailyDate();

  if (date && date !== today) {
    return {
      ok: false,
      error: "Progress out of sync — local progress cleared.",
    };
  }

  const puzzleDate = date ?? today;
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const existing = await db
      .select({ id: gameResult.id })
      .from(gameResult)
      .where(
        and(
          eq(gameResult.userId, session.user.id),
          eq(gameResult.date, puzzleDate),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      return { ok: false, error: "Already played today" };
    }
  }

  return processGuessSubmission(
    guess,
    previousGuesses,
    getDailyWord(),
    MAX_ATTEMPTS,
    isValidGuess,
    puzzleDate,
    previousSignature,
  );
}
