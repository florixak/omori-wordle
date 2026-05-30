"use server";

import { auth } from "@/auth";
import { MAX_ATTEMPTS } from "@/constants";
import { db } from "@/db/drizzle";
import { gameResult, userStats } from "@/db/schema";
import {
  getDailyDate,
  getDailyWord,
  getDailyWordLength,
  isValidGuess,
} from "@/lib/daily-word";
import {
  ProcessGuessResult,
  processGuessSubmission,
  verifyGuessHistory,
} from "@/lib/guess-submission";
import {
  computeStatsAfterGame,
  computeTimeSeconds,
  validateCompletedGame,
} from "@/lib/submit-game";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

export type SubmitGamePayload = {
  date: string;
  guesses: string[];
  startedAt: number | null;
  historySignature?: string;
};

export type SubmitGameResult = { ok: true } | { ok: false; error: string };

type CompletedGameValidation = Extract<
  ReturnType<typeof validateCompletedGame>,
  { ok: true }
>;

const persistCompletedGame = async (
  userId: string,
  payload: SubmitGamePayload,
  validation: CompletedGameValidation,
  answer: string,
  timeSeconds: number | null,
  completedAtMs: number,
): Promise<void> => {
  const existing = await db
    .select({ id: gameResult.id })
    .from(gameResult)
    .where(
      and(eq(gameResult.userId, userId), eq(gameResult.date, payload.date)),
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error("ALREADY_PLAYED");
  }

  await db.insert(gameResult).values({
    userId,
    date: payload.date,
    word: answer,
    wordLength: answer.length,
    attempts: validation.attempts,
    won: validation.won,
    guesses: validation.guesses,
    timeSeconds,
    completedAt: new Date(completedAtMs),
  });

  const [statsRow] = await db
    .select()
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  const nextStats = computeStatsAfterGame(
    statsRow ?? null,
    payload.date,
    validation.won,
    validation.attempts,
  );

  if (statsRow) {
    await db
      .update(userStats)
      .set(nextStats)
      .where(eq(userStats.userId, userId));
  } else {
    await db.insert(userStats).values({
      userId,
      ...nextStats,
    });
  }
};

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
    getDailyWord().word,
    MAX_ATTEMPTS,
    isValidGuess,
    puzzleDate,
    previousSignature,
  );
}

export async function getHint(): Promise<{ hint: string }> {
  const { hint } = getDailyWord();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { hint };
  }

  const today = getDailyDate();

  await db
    .insert(userStats)
    .values({
      userId: session.user.id,
      hintsUsed: 1,
      lastHintDate: today,
    })
    .onConflictDoUpdate({
      target: userStats.userId,
      set: {
        hintsUsed: sql`CASE WHEN ${userStats.lastHintDate} IS DISTINCT FROM ${today} THEN ${userStats.hintsUsed} + 1 ELSE ${userStats.hintsUsed} END`,
        lastHintDate: today,
      },
    });

  return { hint };
}

export async function submitGame(
  payload: SubmitGamePayload,
): Promise<SubmitGameResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { ok: false, error: "Unauthorized" };
  }

  const today = getDailyDate();
  if (payload.date !== today) {
    return { ok: false, error: "Invalid game state" };
  }
  const { word: answer } = getDailyWord();
  const wordLength = getDailyWordLength();

  const validation = validateCompletedGame(
    payload.guesses,
    answer,
    wordLength,
    MAX_ATTEMPTS,
    isValidGuess,
  );

  if (!validation.ok) {
    return validation;
  }

  if (
    !verifyGuessHistory(
      payload.date,
      validation.guesses,
      payload.historySignature,
    )
  ) {
    return { ok: false, error: "Invalid game state" };
  }

  const completedAtMs = Date.now();
  const timeSeconds = computeTimeSeconds(payload.startedAt, completedAtMs);

  try {
    await persistCompletedGame(
      session.user.id,
      payload,
      validation,
      answer,
      timeSeconds,
      completedAtMs,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "ALREADY_PLAYED") {
      return { ok: false, error: "Already played today" };
    }

    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  return { ok: true };
}
