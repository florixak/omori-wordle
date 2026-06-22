import { GUESS_DISTRIBUTION_KEYS } from "@/constants";
import { UserStats } from "@/db/schema";
import { GuessDistributionRow } from "@/types/game-types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatGuessDistribution = (
  distribution: Record<string, number>,
): GuessDistributionRow[] => {
  const counts = GUESS_DISTRIBUTION_KEYS.map((key) => distribution[key] ?? 0);
  const max = Math.max(...counts, 1);

  return GUESS_DISTRIBUTION_KEYS.map((key, i) => ({
    key,
    label: key === "0" ? "X" : key,
    count: counts[i],
    barWidth: `${(counts[i] / max) * 100}%`,
    isLoss: key === "0",
  }));
};

export const computeWinRate = (
  gamesPlayed: number,
  gamesWon: number,
): number => {
  if (gamesPlayed === 0) {
    return 0;
  }

  return Math.round((gamesWon / gamesPlayed) * 100);
};

export const createEmptyStats = (userId: string): UserStats => ({
  userId,
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {},
  lastPlayedDate: null,
  hintsUsed: 0,
  lastHintDate: null,
  keepsakesAvailable: 1,
  lastKeepsakeRefillDate: null,
  keepsakeOfferDate: null,
});

export const getPreviousDate = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() - 1);
  return parsed.toISOString().slice(0, 10);
};
