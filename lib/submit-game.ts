import { UserStats } from "@/db/schema";
import { getGameStatus } from "@/lib/game-logic";

export type ValidateCompletedGameResult =
  | {
      ok: true;
      won: boolean;
      attempts: number;
      guesses: string[];
    }
  | { ok: false; error: string };

export type SubmitGameStatsUpdate = {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<string, number>;
  lastPlayedDate: string;
};

const getPreviousDate = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() - 1);
  return parsed.toISOString().slice(0, 10);
};

export const validateCompletedGame = (
  guesses: string[],
  answer: string,
  wordLength: number,
  maxAttempts: number,
  isGuessValid: (word: string) => boolean,
): ValidateCompletedGameResult => {
  if (guesses.length === 0) {
    return { ok: false, error: "Invalid game state" };
  }

  const normalizedGuesses = guesses.map((guess) => guess.toUpperCase());

  for (const guess of normalizedGuesses) {
    if (guess.length !== wordLength) {
      return { ok: false, error: "Invalid game state" };
    }

    if (!isGuessValid(guess)) {
      return { ok: false, error: "Invalid game state" };
    }
  }

  const status = getGameStatus(normalizedGuesses, answer, maxAttempts);
  if (status === "playing") {
    return { ok: false, error: "Invalid game state" };
  }

  const won = status === "won";

  return {
    ok: true,
    won,
    attempts: won ? normalizedGuesses.length : 0,
    guesses: normalizedGuesses,
  };
};

export const computeStatsAfterGame = (
  previous: UserStats | null,
  date: string,
  won: boolean,
  attempts: number,
): SubmitGameStatsUpdate => {
  const distributionKey = won ? String(attempts) : "0";

  if (!previous) {
    return {
      gamesPlayed: 1,
      gamesWon: won ? 1 : 0,
      currentStreak: 1,
      maxStreak: 1,
      guessDistribution: { [distributionKey]: 1 },
      lastPlayedDate: date,
    };
  }

  const guessDistribution = { ...previous.guessDistribution };
  guessDistribution[distributionKey] =
    (guessDistribution[distributionKey] ?? 0) + 1;

  const yesterday = getPreviousDate(date);
  const currentStreak =
    previous.lastPlayedDate === yesterday ? previous.currentStreak + 1 : 1;
  const maxStreak = Math.max(previous.maxStreak, currentStreak);

  return {
    gamesPlayed: previous.gamesPlayed + 1,
    gamesWon: previous.gamesWon + (won ? 1 : 0),
    currentStreak,
    maxStreak,
    guessDistribution,
    lastPlayedDate: date,
  };
};

export const computeTimeSeconds = (
  startedAt: number | null,
  completedAtMs: number,
): number | null => {
  if (startedAt === null) {
    return null;
  }

  return Math.max(0, Math.floor((completedAtMs - startedAt) / 1000));
};
