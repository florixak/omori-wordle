import { describe, expect, it } from "vitest";

import { TileEvaluation } from "@/types/game-types";

import { getGuessWords, loadStoredGameState } from "./game-state-utils";

const validGuess = {
  word: "APPLE",
  evaluations: [
    "present",
    "absent",
    "correct",
    "absent",
    "present",
  ] as TileEvaluation[],
};

describe("game-state utils", () => {
  it("extracts words from submitted guesses", () => {
    expect(getGuessWords([validGuess])).toEqual(["APPLE"]);
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
      hintUsed: false,
      hint: null,
      revealedWord: null,
      answerHint: null,
    });
  });

  it("migrates legacy stored guesses with result tiles", () => {
    expect(
      loadStoredGameState(
        {
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
      hintUsed: false,
      hint: null,
      revealedWord: null,
      answerHint: null,
    });
  });

  it("rejects malformed submitted guesses without throwing", () => {
    expect(
      loadStoredGameState(
        {
          date: "2026-05-26",
          wordLength: 5,
          submittedGuesses: [{ word: null, evaluations: null }],
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
