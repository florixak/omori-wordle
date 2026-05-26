import { describe, expect, it } from "vitest";

import { processGuessSubmission } from "./guess-submission";

const answer = "PAPER";
const maxAttempts = 6;
const isGuessValid = (word: string) =>
  word.length === answer.length && word !== "ZZZZZ";

describe("processGuessSubmission", () => {
  it("accepts a valid guess and returns tile feedback", () => {
    expect(
      processGuessSubmission("APPLE", [], answer, maxAttempts, isGuessValid),
    ).toMatchObject({
      ok: true,
      guess: "APPLE",
      status: "playing",
    });
  });

  it("rejects guesses that are not in the word list", () => {
    expect(
      processGuessSubmission("ZZZZZ", [], answer, maxAttempts, isGuessValid),
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
