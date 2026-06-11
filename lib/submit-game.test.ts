import { describe, expect, it } from "vitest";

import { ErrorCode } from "@/lib/errors";
import {
  computeStatsAfterGame,
  computeTimeSeconds,
  validateCompletedGame,
} from "./submit-game";

const answer = "PAPER";
const wordLength = 5;
const maxAttempts = 6;
const isGuessValid = (word: string) =>
  word.length === wordLength && word !== "ZZZZZ";

describe("validateCompletedGame", () => {
  it("accepts a winning game", () => {
    expect(
      validateCompletedGame(
        ["APPLE", "PAPER"],
        answer,
        wordLength,
        maxAttempts,
        isGuessValid,
      ),
    ).toEqual({
      ok: true,
      won: true,
      attempts: 2,
      guesses: ["APPLE", "PAPER"],
    });
  });

  it("accepts a losing game with attempts set to 0", () => {
    const guesses = ["APPLE", "GRAPE", "ORANG", "LEMON", "MELON", "PEACH"];

    expect(
      validateCompletedGame(
        guesses,
        answer,
        wordLength,
        maxAttempts,
        isGuessValid,
      ),
    ).toEqual({
      ok: true,
      won: false,
      attempts: 0,
      guesses,
    });
  });

  it("rejects an incomplete game", () => {
    expect(
      validateCompletedGame(
        ["APPLE"],
        answer,
        wordLength,
        maxAttempts,
        isGuessValid,
      ),
    ).toEqual({
      ok: false,
      error: ErrorCode.INVALID_GAME_STATE,
    });
  });
});

describe("computeStatsAfterGame", () => {
  it("initializes stats for a first win", () => {
    expect(computeStatsAfterGame(null, "2026-05-29", true, 3)).toEqual({
      gamesPlayed: 1,
      gamesWon: 1,
      currentStreak: 1,
      maxStreak: 1,
      guessDistribution: { "3": 1 },
      lastPlayedDate: "2026-05-29",
    });
  });

  it("extends the streak when the last game was yesterday", () => {
    expect(
      computeStatsAfterGame(
        {
          userId: "user-1",
          gamesPlayed: 5,
          gamesWon: 4,
          currentStreak: 2,
          maxStreak: 4,
          guessDistribution: { "3": 2, "0": 1 },
          lastPlayedDate: "2026-05-28",
          lastHintDate: null,
          hintsUsed: 0,
        },
        "2026-05-29",
        true,
        2,
      ),
    ).toMatchObject({
      gamesPlayed: 6,
      gamesWon: 5,
      currentStreak: 3,
      maxStreak: 4,
      guessDistribution: { "2": 1, "3": 2, "0": 1 },
      lastPlayedDate: "2026-05-29",
    });
  });
});

describe("computeTimeSeconds", () => {
  it("returns elapsed seconds when startedAt is provided", () => {
    expect(computeTimeSeconds(1_000, 16_000)).toBe(15);
  });

  it("returns null when startedAt is missing", () => {
    expect(computeTimeSeconds(null, 16_000)).toBeNull();
  });
});
