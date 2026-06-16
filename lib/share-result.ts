import { GridTile } from "@/types/game-types";

export type ShareResultMethod = "shared" | "copied";

const isShareCancelled = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

export const shareGameResult = async (
  text: string,
): Promise<ShareResultMethod> => {
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function"
  ) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (error) {
      if (isShareCancelled(error)) {
        throw error;
      }
    }
  }

  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("Share unavailable");
  }

  await navigator.clipboard.writeText(text);
  return "copied";
};

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
