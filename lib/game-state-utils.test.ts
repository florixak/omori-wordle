import { describe, expect, it } from "vitest";

import {
  getGuessResults,
  getGuessWords,
  isStoredGameStateValid,
  parseStoredGameState,
} from "./game-state-utils";

describe("game-state utils", () => {
  it("extracts words and results from submitted guesses", () => {
    const submitted = [
      {
        word: "APPLE",
        result: [
          { letter: "A", state: "present" as const },
          { letter: "P", state: "absent" as const },
          { letter: "P", state: "correct" as const },
          { letter: "L", state: "absent" as const },
          { letter: "E", state: "present" as const },
        ],
      },
    ];

    expect(getGuessWords(submitted)).toEqual(["APPLE"]);
    expect(getGuessResults(submitted)).toEqual([submitted[0].result]);
  });

  it("migrates legacy stored state with parallel arrays", () => {
    expect(
      parseStoredGameState({
        date: "2026-05-26",
        wordLength: 5,
        guesses: ["APPLE"],
        guessResults: [
          [
            { letter: "A", state: "present" },
            { letter: "P", state: "absent" },
            { letter: "P", state: "correct" },
            { letter: "L", state: "absent" },
            { letter: "E", state: "present" },
          ],
        ],
        currentInput: "",
        status: "playing",
        startedAt: null,
      }),
    ).toEqual({
      date: "2026-05-26",
      wordLength: 5,
      submittedGuesses: [
        {
          word: "APPLE",
          result: [
            { letter: "A", state: "present" },
            { letter: "P", state: "absent" },
            { letter: "P", state: "correct" },
            { letter: "L", state: "absent" },
            { letter: "E", state: "present" },
          ],
        },
      ],
      currentInput: "",
      status: "playing",
      startedAt: null,
    });
  });

  it("rejects stored guesses whose result letters do not match the word", () => {
    const invalidState = {
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
      status: "playing" as const,
      startedAt: null,
    };

    expect(isStoredGameStateValid(invalidState, "2026-05-26", 5)).toBe(false);
  });
});
