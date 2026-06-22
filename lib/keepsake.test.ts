import { describe, expect, it } from "vitest";

import {
  computeKeepsakeRefill,
  getMostRecentMonday,
  isKeepsakeOfferPending,
  resolveStatsWithKeepsake,
  wouldStreakBreak,
} from "@/lib/keepsake";
import type { UserStats } from "@/db/schema";

const baseStats: UserStats = {
  userId: "user-1",
  gamesPlayed: 5,
  gamesWon: 4,
  currentStreak: 3,
  maxStreak: 4,
  guessDistribution: { "3": 2, "0": 1 },
  lastPlayedDate: "2026-06-20",
  lastHintDate: null,
  hintsUsed: 0,
  keepsakesAvailable: 1,
  lastKeepsakeRefillDate: "2026-06-16",
  keepsakeOfferDate: null,
};

describe("getMostRecentMonday", () => {
  it("returns the same date when the day is Monday", () => {
    expect(getMostRecentMonday("2026-06-22")).toBe("2026-06-22");
  });

  it("returns the Monday of the current week for later weekdays", () => {
    expect(getMostRecentMonday("2026-06-25")).toBe("2026-06-22");
  });
});

describe("computeKeepsakeRefill", () => {
  it("refills keepsakes when a new week starts", () => {
    expect(computeKeepsakeRefill(baseStats, "2026-06-23")).toEqual({
      keepsakesAvailable: 1,
      lastKeepsakeRefillDate: "2026-06-22",
    });
  });

  it("keeps the current count within the same week", () => {
    expect(
      computeKeepsakeRefill(
        { ...baseStats, keepsakesAvailable: 0 },
        "2026-06-18",
      ),
    ).toEqual({
      keepsakesAvailable: 0,
      lastKeepsakeRefillDate: "2026-06-16",
    });
  });
});

describe("wouldStreakBreak", () => {
  it("detects a missed day", () => {
    expect(wouldStreakBreak(baseStats, "2026-06-22", true)).toBe(true);
  });

  it("detects a loss on a consecutive day", () => {
    expect(
      wouldStreakBreak(
        { ...baseStats, lastPlayedDate: "2026-06-21" },
        "2026-06-22",
        false,
      ),
    ).toBe(true);
  });

  it("does not break on a consecutive win", () => {
    expect(
      wouldStreakBreak(
        { ...baseStats, lastPlayedDate: "2026-06-21" },
        "2026-06-22",
        true,
      ),
    ).toBe(false);
  });
});

describe("resolveStatsWithKeepsake", () => {
  it("offers a keepsake instead of resetting the streak", () => {
    const resolution = resolveStatsWithKeepsake(
      baseStats,
      "2026-06-22",
      true,
      2,
      1,
    );

    expect(resolution.kind).toBe("offer");
    expect(resolution.stats.currentStreak).toBe(3);
    expect(resolution.stats.lastPlayedDate).toBe("2026-06-22");
  });

  it("resets the streak when no keepsakes remain", () => {
    const resolution = resolveStatsWithKeepsake(
      baseStats,
      "2026-06-22",
      false,
      0,
      0,
    );

    expect(resolution.kind).toBe("reset");
    expect(resolution.stats.currentStreak).toBe(1);
  });
});

describe("isKeepsakeOfferPending", () => {
  it("returns true when a keepsake offer is stored for today", () => {
    expect(
      isKeepsakeOfferPending(
        { ...baseStats, keepsakeOfferDate: "2026-06-22" },
        "2026-06-22",
      ),
    ).toBe(true);
  });

  it("returns false after the offer is resolved", () => {
    expect(isKeepsakeOfferPending(baseStats, "2026-06-22")).toBe(false);
  });
});
