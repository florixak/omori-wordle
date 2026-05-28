import { describe, expect, it } from "vitest";

import { TileEvaluation } from "@/types/game-types";

import { buildGridRows } from "./grid-view";

const validGuess = {
  word: "APPLE",
  evaluations: [
    "present",
    "absent",
    "correct",
    "absent",
    "present",
  ] as TileEvaluation[],
};

describe("buildGridRows", () => {
  it("maps letters from the active input row", () => {
    const rows = buildGridRows([], "PA", 5, 6);

    expect(rows[0]).toEqual([
      { letter: "P", display: "active" },
      { letter: "A", display: "active" },
      { letter: "", display: "empty" },
      { letter: "", display: "empty" },
      { letter: "", display: "empty" },
    ]);
  });

  it("builds scored, active, and empty rows", () => {
    expect(
      buildGridRows([validGuess], "PA", 5, 6).map((row) =>
        row.map((tile) => tile.display),
      ),
    ).toEqual([
      ["present", "absent", "correct", "absent", "present"],
      ["active", "active", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "empty", "empty"],
    ]);
  });
});
