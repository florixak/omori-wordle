import { createHmac } from "crypto";
import { beforeAll, describe, expect, it } from "vitest";

import { processGuessSubmission } from "./guess-submission";

const TEST_DATE = "2026-05-26";
const TEST_SECRET = "test-game-history-secret";

const signHistory = (date: string, guesses: string[]): string => {
  return createHmac("sha256", TEST_SECRET)
    .update(JSON.stringify({ date, guesses }))
    .digest("hex");
};

beforeAll(() => {
  process.env.GAME_HISTORY_SECRET = TEST_SECRET;
});

const answer = "PAPER";
const maxAttempts = 6;
const isGuessValid = (word: string) =>
  word.length === answer.length && word !== "ZZZZZ";

describe("processGuessSubmission", () => {
  it("accepts a valid guess and returns tile feedback", () => {
    expect(
      processGuessSubmission(
        "APPLE",
        [],
        answer,
        maxAttempts,
        isGuessValid,
        TEST_DATE,
      ),
    ).toMatchObject({
      ok: true,
      guess: "APPLE",
      status: "playing",
      signature: signHistory(TEST_DATE, ["APPLE"]),
    });
  });

  it("rejects guesses that are not in the word list", () => {
    expect(
      processGuessSubmission(
        "ZZZZZ",
        [],
        answer,
        maxAttempts,
        isGuessValid,
        TEST_DATE,
      ),
    ).toEqual({
      ok: false,
      error: "Not in word list",
    });
  });

  it("rejects submissions after the game is already won", () => {
    expect(
      processGuessSubmission(
        "APPLE",
        ["PAPER"],
        answer,
        maxAttempts,
        isGuessValid,
        TEST_DATE,
        signHistory(TEST_DATE, ["PAPER"]),
      ),
    ).toEqual({
      ok: false,
      error: "Game already finished",
    });
  });

  it("rejects submissions after all attempts are used", () => {
    const previousGuesses = [
      "APPLE",
      "GRAPE",
      "ORANG",
      "LEMON",
      "MELON",
      "PEACH",
    ];

    expect(
      processGuessSubmission(
        "CHAIR",
        previousGuesses,
        answer,
        maxAttempts,
        isGuessValid,
        TEST_DATE,
        signHistory(TEST_DATE, previousGuesses),
      ),
    ).toEqual({
      ok: false,
      error: "No attempts remaining",
    });
  });

  it("rejects tampered prior guess history", () => {
    expect(
      processGuessSubmission(
        "APPLE",
        ["ZZZZZ"],
        answer,
        maxAttempts,
        isGuessValid,
        TEST_DATE,
        "not-a-valid-signature",
      ),
    ).toEqual({
      ok: false,
      error: "Invalid game state",
    });
  });

  it("rejects prior history without date or signature", () => {
    expect(
      processGuessSubmission(
        "APPLE",
        ["GRAPE"],
        answer,
        maxAttempts,
        isGuessValid,
      ),
    ).toEqual({
      ok: false,
      error: "Invalid game state",
    });
  });

  it("normalizes guess casing before evaluation", () => {
    expect(
      processGuessSubmission("paper", [], answer, maxAttempts, isGuessValid),
    ).toMatchObject({
      ok: true,
      guess: "PAPER",
      status: "won",
    });
  });
});
