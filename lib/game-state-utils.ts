import {
  GameState,
  GuessResult,
  SubmittedGuess,
  TileState,
} from "@/types/game-types";

export const getGuessWords = (submitted: SubmittedGuess[]): string[] =>
  submitted.map((guess) => guess.word);

export const getGuessResults = (submitted: SubmittedGuess[]): GuessResult[] =>
  submitted.map((guess) => guess.result);

const TILE_STATES = new Set<TileState>(["correct", "present", "absent"]);

const isGuessResultValid = (
  result: unknown,
  wordLength: number,
): result is GuessResult => {
  if (!Array.isArray(result) || result.length !== wordLength) {
    return false;
  }

  return result.every(
    (tile) =>
      tile !== null &&
      typeof tile === "object" &&
      typeof tile.letter === "string" &&
      typeof tile.state === "string" &&
      TILE_STATES.has(tile.state as TileState),
  );
};

const isSubmittedGuessValid = (
  guess: unknown,
  wordLength: number,
): guess is SubmittedGuess => {
  if (guess === null || typeof guess !== "object") {
    return false;
  }

  const value = guess as SubmittedGuess;

  if (typeof value.word !== "string" || value.word.length !== wordLength) {
    return false;
  }

  if (!isGuessResultValid(value.result, wordLength)) {
    return false;
  }

  return value.result.every(
    (tile, index) => tile.letter === value.word[index],
  );
};

const parseSubmittedGuesses = (
  submittedGuesses: unknown,
  wordLength: number,
): SubmittedGuess[] | undefined => {
  if (!Array.isArray(submittedGuesses)) {
    return undefined;
  }

  for (const guess of submittedGuesses) {
    if (!isSubmittedGuessValid(guess, wordLength)) {
      return undefined;
    }
  }

  return submittedGuesses;
};

export const loadStoredGameState = (
  stored: unknown,
  date: string,
  wordLength: number,
): GameState | undefined => {
  if (!stored || typeof stored !== "object") {
    return undefined;
  }

  const value = stored as Partial<GameState>;
  if (value.date !== date || value.wordLength !== wordLength) {
    return undefined;
  }

  const submittedGuesses = parseSubmittedGuesses(
    value.submittedGuesses,
    wordLength,
  );
  if (!submittedGuesses) {
    return undefined;
  }

  const status =
    value.status === "won" || value.status === "lost" ? value.status : "playing";

  if (status !== "playing" && submittedGuesses.length === 0) {
    return undefined;
  }

  return {
    date,
    wordLength,
    submittedGuesses,
    currentInput:
      typeof value.currentInput === "string" ? value.currentInput : "",
    status,
    startedAt: typeof value.startedAt === "number" ? value.startedAt : null,
    historySignature:
      typeof value.historySignature === "string"
        ? value.historySignature
        : undefined,
  };
};
