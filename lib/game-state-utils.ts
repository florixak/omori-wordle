import {
  GameState,
  SubmittedGuess,
  TileEvaluation,
} from "@/types/game-types";

export const getGuessWords = (submitted: SubmittedGuess[]): string[] =>
  submitted.map((guess) => guess.word);

const TILE_EVALUATIONS = new Set<TileEvaluation>([
  "correct",
  "present",
  "absent",
]);

const isEvaluationsValid = (
  evaluations: unknown,
  wordLength: number,
): evaluations is TileEvaluation[] => {
  if (!Array.isArray(evaluations) || evaluations.length !== wordLength) {
    return false;
  }

  return evaluations.every((evaluation) =>
    TILE_EVALUATIONS.has(evaluation as TileEvaluation),
  );
};

const normalizeSubmittedGuess = (
  guess: unknown,
  wordLength: number,
): SubmittedGuess | undefined => {
  if (guess === null || typeof guess !== "object") {
    return undefined;
  }

  const value = guess as {
    word?: unknown;
    evaluations?: unknown;
    result?: unknown;
  };

  if (typeof value.word !== "string" || value.word.length !== wordLength) {
    return undefined;
  }

  const word = value.word.toUpperCase();
  if (word !== value.word) {
    return undefined;
  }

  let evaluations: unknown = value.evaluations;

  if (!evaluations && Array.isArray(value.result)) {
    evaluations = value.result.map((tile) => {
      if (tile === null || typeof tile !== "object") {
        return undefined;
      }

      return "state" in tile &&
        typeof (tile as { state?: unknown }).state === "string"
        ? (tile as { state: string }).state
        : undefined;
    });
  }

  if (!isEvaluationsValid(evaluations, wordLength)) {
    return undefined;
  }

  return { word, evaluations };
};

const parseSubmittedGuesses = (
  submittedGuesses: unknown,
  wordLength: number,
): SubmittedGuess[] | undefined => {
  if (!Array.isArray(submittedGuesses)) {
    return undefined;
  }

  const parsed: SubmittedGuess[] = [];

  for (const guess of submittedGuesses) {
    const normalized = normalizeSubmittedGuess(guess, wordLength);
    if (!normalized) {
      return undefined;
    }

    parsed.push(normalized);
  }

  return parsed;
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
    value.status === "won" || value.status === "lost"
      ? value.status
      : "playing";

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
    hintUsed: value.hintUsed === true,
    historySignature:
      typeof value.historySignature === "string"
        ? value.historySignature
        : undefined,
  };
};
