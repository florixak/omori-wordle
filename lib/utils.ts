import { GUESS_DISTRIBUTION_KEYS } from "@/constants";
import { UserStats } from "@/db/schema";
import { GridTile, GuessDistributionRow } from "@/types/game-types";
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
});

export const generateShareText = (
  dayNumber: number,
  attempts: number,
  results: GridTile[][],
  hintUsed: boolean,
): string => {
  const score = attempts === 0 ? "X" : `${attempts}/6`;

  const grid = results
    .map((row) =>
      row
        .map((tile) => {
          if (tile.display === "correct") return "⬜";
          if (tile.display === "present") return "🟨";
          return "⬛";
        })
        .join(""),
    )
    .join("\n");

  const hint = hintUsed ? "\n💡 Hint used" : "";

  return `OMORI Wordle #${dayNumber} ${score}\n\n${grid}${hint}\n\nomori-wordle.com`;
};
