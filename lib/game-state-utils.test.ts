import { describe, expect, it } from "vitest";

import {
  getGuessResults,
  getGuessWords,
  loadStoredGameState,
} from "./game-state-utils";

const validGuess = {
  word: "APPLE",
  result: [
    { letter: "A", state: "present" as const },
    { letter: "P", state: "absent" as const },
    { letter: "P", state: "correct" as const },
    { letter: "L", state: "absent" as const },
    { letter: "E", state: "present" as const },
  ],
};

describe("game-state utils", () => {
  it("extracts words and results from submitted guesses", () => {
    const submitted = [validGuess];

    expect(getGuessWords(submitted)).toEqual(["APPLE"]);
    expect(getGuessResults(submitted)).toEqual([validGuess.result]);
  });

  it("loads a valid stored game state for the current puzzle", () => {
    expect(
      loadStoredGameState(
        {
          date: "2026-05-26",
          wordLength: 5,
          submittedGuesses: [validGuess],
          currentInput: "",
          status: "playing",
          startedAt: null,
        },
        "2026-05-26",
        5,
      ),
    ).toEqual({
      date: "2026-05-26",
      wordLength: 5,
      submittedGuesses: [validGuess],
      currentInput: "",
      status: "playing",
      startedAt: null,
    });
  });

  it("rejects stored state for a different day or word length", () => {
    const stored = {
      date: "2026-05-26",
      wordLength: 5,
      submittedGuesses: [validGuess],
      currentInput: "",
      status: "playing" as const,
      startedAt: null,
    };

    expect(loadStoredGameState(stored, "2026-05-27", 5)).toBeUndefined();
    expect(loadStoredGameState(stored, "2026-05-26", 6)).toBeUndefined();
  });

  it("rejects finished games with no submitted guesses", () => {
    expect(
      loadStoredGameState(
        {
          date: "2026-05-26",
          wordLength: 5,
          submittedGuesses: [],
          currentInput: "",
          status: "won",
          startedAt: null,
        },
        "2026-05-26",
        5,
      ),
    ).toBeUndefined();
  });

  it("rejects stored guesses whose result letters do not match the word", () => {
    expect(
      loadStoredGameState(
        {
          date: "2026-05-26",
          wordLength: 5,
          submittedGuesses: [
            {
              word: "APPLE",
              result: [
                { letter: "G", state: "present" as const },
                { letter: "R", state: "absent" as const },
                { letter: "A", state: "correct" as const },
                { letter: "P", state: "absent" as const },
                { letter: "E", state: "present" as const },
              ],
            },
          ],
          currentInput: "",
          status: "playing",
          startedAt: null,
        },
        "2026-05-26",
        5,
      ),
    ).toBeUndefined();
  });

  it("rejects malformed submitted guesses without throwing", () => {
    expect(
      loadStoredGameState(
        {
          date: "2026-05-26",
          wordLength: 5,
          submittedGuesses: [{ word: null, result: null }],
          currentInput: "",
          status: "playing",
          startedAt: null,
        },
        "2026-05-26",
        5,
      ),
    ).toBeUndefined();
  });
});
