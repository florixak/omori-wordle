import { GameStatus, GuessResult, TileState } from "@/types/game-types";

export const evaluateGuess = (guess: string, answer: string): GuessResult => {
  const guessLetters = guess.toUpperCase().split("");
  const answerLetters = answer.toUpperCase().split("");

  // Initialize result with all letters marked as absent
  const result: GuessResult = Array(guessLetters.length)
    .fill(null)
    .map((_, i) => ({
      letter: guessLetters[i],
      state: "absent" as TileState,
    }));

  const available: (string | null)[] = [...answerLetters];

  // First pass: mark correct letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i].state = "correct";
      available[i] = null;
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i].state === "correct") continue;

    const idx = available.indexOf(guessLetters[i]);
    if (idx !== -1) {
      result[i].state = "present";
      available[idx] = null;
    }
  }

  return result;
};

export const getKeyboardState = (
  guesses: string[],
  answer: string,
): Record<string, TileState> => {
  return getKeyboardStateFromResults(
    guesses.map((guess) => evaluateGuess(guess, answer)),
  );
};

export const getKeyboardStateFromResults = (
  results: GuessResult[],
): Record<string, TileState> => {
  const state: Record<string, TileState> = {};

  const priority: Record<TileState, number> = {
    absent: 1,
    present: 2,
    correct: 3,
  };

  for (const result of results) {
    for (const { letter, state: tileState } of result) {
      const current = state[letter];

      if (!current || priority[tileState] > priority[current]) {
        state[letter] = tileState;
      }
    }
  }

  return state;
};

export const isWon = (guesses: string[], answer: string): boolean => {
  if (guesses.length === 0) return false;
  return guesses[guesses.length - 1].toUpperCase() === answer.toUpperCase();
};

export const isLost = (
  guesses: string[],
  maxAttempts: number,
  answer: string,
): boolean => {
  return guesses.length >= maxAttempts && !isWon(guesses, answer);
};

export const getGameStatus = (
  guesses: string[],
  answer: string,
  maxAttempts = 6,
): GameStatus => {
  if (isWon(guesses, answer)) return "won";
  if (isLost(guesses, maxAttempts, answer)) return "lost";
  return "playing";
};
