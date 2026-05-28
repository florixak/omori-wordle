import {
  GameStatus,
  SubmittedGuess,
  TileEvaluation,
} from "@/types/game-types";

export const evaluateGuess = (
  guess: string,
  answer: string,
): TileEvaluation[] => {
  const guessLetters = guess.toUpperCase().split("");
  const answerLetters = answer.toUpperCase().split("");

  const result: TileEvaluation[] = Array(guessLetters.length).fill("absent");
  const available: (string | null)[] = [...answerLetters];

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === answerLetters[i]) {
      result[i] = "correct";
      available[i] = null;
    }
  }

  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i] === "correct") continue;

    const idx = available.indexOf(guessLetters[i]);
    if (idx !== -1) {
      result[i] = "present";
      available[idx] = null;
    }
  }

  return result;
};

export const getKeyboardState = (
  guesses: string[],
  answer: string,
): Record<string, TileEvaluation> => {
  return getKeyboardStateFromGuesses(
    guesses.map((word) => ({
      word,
      evaluations: evaluateGuess(word, answer),
    })),
  );
};

export const getKeyboardStateFromGuesses = (
  guesses: SubmittedGuess[],
): Record<string, TileEvaluation> => {
  const state: Record<string, TileEvaluation> = {};

  const priority: Record<TileEvaluation, number> = {
    absent: 1,
    present: 2,
    correct: 3,
  };

  for (const guess of guesses) {
    for (let index = 0; index < guess.word.length; index++) {
      const letter = guess.word[index];
      const tileState = guess.evaluations[index];
      const current = state[letter];

      if (!current || priority[tileState] > priority[current]) {
        state[letter] = tileState;
      }
    }
  }

  return state;
};

export const isWon = (guesses: string[], answer: string): boolean => {
  if (guesses.length === 0) {
    return false;
  }
  const normalizedAnswer = answer.toUpperCase();
  return guesses.some((guess) => guess.toUpperCase() === normalizedAnswer);
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
