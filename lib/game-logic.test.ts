import { describe, expect, it } from "vitest";

import {
  evaluateGuess,
  getGameStatus,
  getKeyboardState,
  getKeyboardStateFromResults,
  isLost,
  isWon,
} from "./game-logic";

describe("evaluateGuess", () => {
  it("marks correct, present, and absent tiles", () => {
    expect(evaluateGuess("APPLE", "PAPER")).toEqual([
      { letter: "A", state: "present" },
      { letter: "P", state: "present" },
      { letter: "P", state: "correct" },
      { letter: "L", state: "absent" },
      { letter: "E", state: "present" },
    ]);
  });
});

describe("getKeyboardState", () => {
  it("keeps the highest-priority state for letters across multiple guesses", () => {
    expect(getKeyboardState(["APPLE", "PAPER"], "PAPER")).toEqual({
      A: "correct",
      P: "correct",
      L: "absent",
      E: "correct",
      R: "correct",
    });
  });
});

describe("getKeyboardStateFromResults", () => {
  it("derives keyboard state from stored guess results", () => {
    const results = [
      evaluateGuess("APPLE", "PAPER"),
      evaluateGuess("PAPER", "PAPER"),
    ];

    expect(getKeyboardStateFromResults(results)).toEqual({
      A: "correct",
      P: "correct",
      L: "absent",
      E: "correct",
      R: "correct",
    });
  });
});

describe("game status helpers", () => {
  it("detects wins and losses from guesses", () => {
    expect(isWon(["PAPER"], "PAPER")).toBe(true);
    expect(isWon(["WRONG", "SPACE", "PAPER"], "PAPER")).toBe(true);
    expect(isWon([], "PAPER")).toBe(false);
    expect(
      isLost(
        ["GUESS", "TRIES", "OTHER", "WORDS", "ALONG", "PAPER"],
        6,
        "PAPER",
      ),
    ).toBe(false);
    expect(
      isLost(
        ["GUESS", "TRIES", "OTHER", "WORDS", "ALONG", "WRONG"],
        6,
        "PAPER",
      ),
    ).toBe(true);
    expect(getGameStatus(["PAPER"], "PAPER")).toBe("won");
    expect(
      getGameStatus(
        ["WRONG", "TRIES", "OTHER", "WORDS", "ALONG", "NOPE"],
        "PAPER",
      ),
    ).toBe("lost");
    expect(getGameStatus(["WRONG"], "PAPER")).toBe("playing");
  });
});
