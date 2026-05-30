import { GUESS_DISTRIBUTION_KEYS } from "@/constants";
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
