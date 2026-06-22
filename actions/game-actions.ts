"use server";

import { auth } from "@/auth";
import { MAX_ATTEMPTS, MIN_ATTEMPTS_FOR_HINT } from "@/constants";
import { db } from "@/db/drizzle";
import { gameResult, userStats } from "@/db/schema";
import {
  getDailyDate,
  getDailyWord,
  getDailyWordLength,
  isValidGuess,
} from "@/lib/daily-word";
import { gameResultToGameState } from "@/lib/game-state-utils";
import {
  ProcessGuessResult,
  processGuessSubmission,
  signGuessHistory,
  verifyGuessHistory,
} from "@/lib/guess-submission";
import { getGameStatus } from "@/lib/game-logic";
import {
  computeKeepsakeRefill,
  isKeepsakeOfferPending,
  resolveStatsWithKeepsake,
} from "@/lib/keepsake";
import { AppError, ErrorCode, type ErrorResult } from "@/lib/errors";
import { computeTimeSeconds, validateCompletedGame } from "@/lib/submit-game";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { GameState } from "@/types/game-types";

export type SubmitGamePayload = {
  date: string;
  guesses: string[];
  startedAt: number | null;
  historySignature?: string;
};

export type SubmitGameResult =
  | { ok: true; keepsakeOffer?: true; streakReset?: true }
  | ErrorResult;

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
): Promise<{ keepsakeOffer: boolean; streakReset: boolean }> => {
  const existing = await db
    .select({ id: gameResult.id })
    .from(gameResult)
    .where(
      and(eq(gameResult.userId, userId), eq(gameResult.date, payload.date)),
    )
    .limit(1);

  if (existing.length > 0) {
    throw new AppError(ErrorCode.ALREADY_PLAYED_TODAY);
  }

  return db.transaction(async (tx) => {
    await tx.insert(gameResult).values({
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

    const [statsRow] = await tx
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    const keepsakeRefill = computeKeepsakeRefill(
      statsRow ?? null,
      payload.date,
    );
    const resolution = resolveStatsWithKeepsake(
      statsRow ?? null,
      payload.date,
      validation.won,
      validation.attempts,
      keepsakeRefill.keepsakesAvailable,
    );

    const nextStats = {
      ...resolution.stats,
      ...keepsakeRefill,
      keepsakeOfferDate: resolution.kind === "offer" ? payload.date : null,
    };

    if (statsRow) {
      await tx
        .update(userStats)
        .set(nextStats)
        .where(eq(userStats.userId, userId));
    } else {
      await tx.insert(userStats).values({
        userId,
        ...nextStats,
      });
    }

    return {
      keepsakeOffer: resolution.kind === "offer",
      streakReset: resolution.kind === "reset",
    };
  });
};

export type ProcessGuessActionResult =
  | (Extract<ProcessGuessResult, { ok: true }> & {
      revealedWord?: string;
      answerHint?: string;
    })
  | Extract<ProcessGuessResult, { ok: false }>;

export async function processGuess(
  guess: string,
  previousGuesses: string[],
  date?: string,
  previousSignature?: string,
): Promise<ProcessGuessActionResult> {
  const today = getDailyDate();

  if (date && date !== today) {
    return {
      ok: false,
      error: ErrorCode.PROGRESS_OUT_OF_SYNC,
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
      return { ok: false, error: ErrorCode.ALREADY_PLAYED_TODAY };
    }
  }

  const result = processGuessSubmission(
    guess,
    previousGuesses,
    getDailyWord().word,
    MAX_ATTEMPTS,
    isValidGuess,
    puzzleDate,
    previousSignature,
  );

  if (!result.ok) {
    return result;
  }

  if (result.status === "won" || result.status === "lost") {
    const { word, hint } = getDailyWord();
    return {
      ...result,
      revealedWord: word,
      answerHint: hint,
    };
  }

  return result;
}

export type GetHintPayload = {
  date: string;
  guesses: string[];
  historySignature?: string;
};

export type GetHintResult = { ok: true; hint: string } | ErrorResult;

export async function getHint(payload: GetHintPayload): Promise<GetHintResult> {
  const today = getDailyDate();

  if (payload.date !== today) {
    return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
  }

  const guesses = payload.guesses.map((guess) => guess.toUpperCase());

  if (guesses.length < MIN_ATTEMPTS_FOR_HINT) {
    return {
      ok: false,
      error: ErrorCode.HINT_MIN_GUESSES_REQUIRED,
    };
  }

  for (const guess of guesses) {
    if (!isValidGuess(guess)) {
      return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
    }
  }

  if (!verifyGuessHistory(payload.date, guesses, payload.historySignature)) {
    return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
  }

  const { word: answer, hint } = getDailyWord();
  const status = getGameStatus(guesses, answer, MAX_ATTEMPTS);

  if (status !== "playing") {
    return { ok: false, error: ErrorCode.GAME_ALREADY_COMPLETED };
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
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
  }

  return { ok: true, hint };
}

export type GetCompletedGameRevealResult =
  | { ok: true; revealedWord: string; answerHint: string }
  | ErrorResult;

export async function getCompletedGameReveal(
  payload: GetHintPayload,
): Promise<GetCompletedGameRevealResult> {
  const today = getDailyDate();

  if (payload.date !== today) {
    return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
  }

  const guesses = payload.guesses.map((guess) => guess.toUpperCase());

  if (guesses.length === 0) {
    return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
  }

  for (const guess of guesses) {
    if (!isValidGuess(guess)) {
      return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
    }
  }

  if (!verifyGuessHistory(payload.date, guesses, payload.historySignature)) {
    return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
  }

  const { word: answer, hint } = getDailyWord();
  const status = getGameStatus(guesses, answer, MAX_ATTEMPTS);

  if (status === "playing") {
    return { ok: false, error: ErrorCode.GAME_NOT_FINISHED };
  }

  return { ok: true, revealedWord: answer, answerHint: hint };
}

export async function submitGame(
  payload: SubmitGamePayload,
): Promise<SubmitGameResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { ok: false, error: ErrorCode.UNAUTHORIZED };
  }

  const today = getDailyDate();
  if (payload.date !== today) {
    return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
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
    return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
  }

  const completedAtMs = Date.now();
  const timeSeconds = computeTimeSeconds(payload.startedAt, completedAtMs);

  try {
    const { keepsakeOffer, streakReset } = await persistCompletedGame(
      session.user.id,
      payload,
      validation,
      answer,
      timeSeconds,
      completedAtMs,
    );

    return {
      ok: true,
      ...(keepsakeOffer ? { keepsakeOffer: true } : {}),
      ...(streakReset ? { streakReset: true } : {}),
    };
  } catch (error) {
    if (error instanceof AppError) {
      return { ok: false, error: error.code };
    }

    return { ok: false, error: ErrorCode.UNKNOWN_ERROR };
  }
}

export type KeepsakeActionResult = { ok: true } | ErrorResult;

export async function applyKeepsake(): Promise<KeepsakeActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { ok: false, error: ErrorCode.UNAUTHORIZED };
  }

  const today = getDailyDate();

  try {
    const [statsRow] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, session.user.id))
      .limit(1);

    if (!statsRow || !isKeepsakeOfferPending(statsRow, today)) {
      return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
    }

    await db
      .update(userStats)
      .set({
        keepsakesAvailable: statsRow.keepsakesAvailable - 1,
        keepsakeOfferDate: null,
      })
      .where(eq(userStats.userId, session.user.id));

    return { ok: true };
  } catch (error) {
    if (error instanceof AppError) {
      return { ok: false, error: error.code };
    }

    return { ok: false, error: ErrorCode.UNKNOWN_ERROR };
  }
}

export async function declineKeepsake(): Promise<KeepsakeActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { ok: false, error: ErrorCode.UNAUTHORIZED };
  }

  const today = getDailyDate();

  try {
    const [statsRow] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, session.user.id))
      .limit(1);

    if (!statsRow || !isKeepsakeOfferPending(statsRow, today)) {
      return { ok: false, error: ErrorCode.INVALID_GAME_STATE };
    }

    await db
      .update(userStats)
      .set({
        currentStreak: 1,
        keepsakeOfferDate: null,
      })
      .where(eq(userStats.userId, session.user.id));

    return { ok: true };
  } catch (error) {
    if (error instanceof AppError) {
      return { ok: false, error: error.code };
    }

    return { ok: false, error: ErrorCode.UNKNOWN_ERROR };
  }
}

export async function getPendingKeepsakeOffer(): Promise<{
  ok: true;
  pending: boolean;
} | null> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const today = getDailyDate();
  const [statsRow] = await db
    .select({ keepsakeOfferDate: userStats.keepsakeOfferDate })
    .from(userStats)
    .where(eq(userStats.userId, session.user.id))
    .limit(1);

  return {
    ok: true,
    pending: statsRow?.keepsakeOfferDate === today,
  };
}

export const loadTodayCompletedGameState = async (
  userId: string,
): Promise<GameState | null> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || session.user.id !== userId) {
    return null;
  }

  const today = getDailyDate();
  const dailyWord = getDailyWord();

  const [row] = await db
    .select()
    .from(gameResult)
    .where(and(eq(gameResult.userId, userId), eq(gameResult.date, today)))
    .limit(1);

  if (!row || row.word.toUpperCase() !== dailyWord.word.toUpperCase()) {
    return null;
  }

  const [statsRow] = await db
    .select({ lastHintDate: userStats.lastHintDate })
    .from(userStats)
    .where(eq(userStats.userId, userId))
    .limit(1);

  const hintUsed = statsRow?.lastHintDate === today;

  return gameResultToGameState(row, {
    answerHint: dailyWord.hint,
    hintUsed,
    historySignature: signGuessHistory(today, row.guesses),
  });
};

export async function getTodayCompletedGame(): Promise<{
  ok: true;
  gameState: GameState;
} | null> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const gameState = await loadTodayCompletedGameState(session.user.id);

  if (!gameState) {
    return null;
  }

  return { ok: true, gameState };
}
