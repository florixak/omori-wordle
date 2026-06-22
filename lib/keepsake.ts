import { UserStats } from "@/db/schema";
import {
  computeStatsAfterGame,
  type SubmitGameStatsUpdate,
} from "@/lib/submit-game";
import { getPreviousDate } from "@/lib/utils";

export const getMostRecentMonday = (date: string): string => {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  const day = parsed.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  parsed.setUTCDate(parsed.getUTCDate() - daysSinceMonday);
  return parsed.toISOString().slice(0, 10);
};

export type KeepsakeRefillUpdate = {
  keepsakesAvailable: number;
  lastKeepsakeRefillDate: string;
};

export const computeKeepsakeRefill = (
  previous: UserStats | null,
  today: string,
): KeepsakeRefillUpdate => {
  const monday = getMostRecentMonday(today);

  if (
    !previous?.lastKeepsakeRefillDate ||
    monday > previous.lastKeepsakeRefillDate
  ) {
    return {
      keepsakesAvailable: 1,
      lastKeepsakeRefillDate: monday,
    };
  }

  return {
    keepsakesAvailable: previous.keepsakesAvailable,
    lastKeepsakeRefillDate: previous.lastKeepsakeRefillDate,
  };
};

export const wouldStreakBreak = (
  previous: UserStats | null,
  date: string,
  won: boolean,
): boolean => {
  if (!previous || previous.currentStreak === 0) {
    return false;
  }

  const yesterday = getPreviousDate(date);
  const missedDay = previous.lastPlayedDate !== yesterday;
  const lostGame = !won;

  return missedDay || lostGame;
};

export type KeepsakeStatsResolution =
  | { kind: "normal"; stats: SubmitGameStatsUpdate }
  | { kind: "offer"; stats: SubmitGameStatsUpdate }
  | { kind: "reset"; stats: SubmitGameStatsUpdate };

export const resolveStatsWithKeepsake = (
  previous: UserStats | null,
  date: string,
  won: boolean,
  attempts: number,
  keepsakesAvailable: number,
): KeepsakeStatsResolution => {
  const baseStats = computeStatsAfterGame(previous, date, won, attempts);

  if (!wouldStreakBreak(previous, date, won)) {
    return { kind: "normal", stats: baseStats };
  }

  if (keepsakesAvailable > 0 && previous) {
    return {
      kind: "offer",
      stats: {
        ...baseStats,
        currentStreak: previous.currentStreak,
        maxStreak: previous.maxStreak,
      },
    };
  }

  return {
    kind: "reset",
    stats: {
      ...baseStats,
      currentStreak: 1,
      maxStreak: previous?.maxStreak ?? 1,
    },
  };
};

export const isKeepsakeOfferPending = (
  stats: UserStats,
  today: string,
): boolean => stats.keepsakeOfferDate === today;
