import { GameState, GuessResult, SubmittedGuess } from "@/types/game-types";

export const getGuessWords = (submitted: SubmittedGuess[]): string[] =>
  submitted.map((guess) => guess.word);

export const getGuessResults = (submitted: SubmittedGuess[]): GuessResult[] =>
  submitted.map((guess) => guess.result);

type LegacyStoredGameState = {
  date: string;
  wordLength: number;
  guesses?: string[];
  guessResults?: GuessResult[];
  submittedGuesses?: SubmittedGuess[];
  currentInput?: string;
  status?: GameState["status"];
  startedAt?: number | null;
};

const isSubmittedGuessValid = (
  guess: SubmittedGuess,
  wordLength: number,
): boolean => {
  if (guess.word.length !== wordLength || guess.result.length !== wordLength) {
    return false;
  }

  return guess.result.every(
    (tile, index) => tile.letter === guess.word[index],
  );
};

export const parseStoredGameState = (
  stored: unknown,
): GameState | undefined => {
  if (!stored || typeof stored !== "object") return undefined;

  const value = stored as LegacyStoredGameState;
  if (typeof value.date !== "string" || typeof value.wordLength !== "number") {
    return undefined;
  }

  const base = {
    date: value.date,
    wordLength: value.wordLength,
    currentInput:
      typeof value.currentInput === "string" ? value.currentInput : "",
    status:
      value.status === "won" || value.status === "lost"
        ? value.status
        : "playing",
    startedAt: typeof value.startedAt === "number" ? value.startedAt : null,
  } satisfies Omit<GameState, "submittedGuesses">;

  if (Array.isArray(value.submittedGuesses)) {
    return { ...base, submittedGuesses: value.submittedGuesses };
  }

  if (!Array.isArray(value.guesses) || !Array.isArray(value.guessResults)) {
    return undefined;
  }

  if (value.guesses.length !== value.guessResults.length) {
    return undefined;
  }

  return {
    ...base,
    submittedGuesses: value.guesses.map((word, index) => ({
      word,
      result: value.guessResults![index],
    })),
  };
};

export const isStoredGameStateValid = (
  storedState: GameState,
  date: string,
  wordLength: number,
): boolean => {
  if (storedState.date !== date || storedState.wordLength !== wordLength) {
    return false;
  }

  if (
    storedState.status !== "playing" &&
    storedState.submittedGuesses.length === 0
  ) {
    return false;
  }

  return storedState.submittedGuesses.every((guess) =>
    isSubmittedGuessValid(guess, wordLength),
  );
};
