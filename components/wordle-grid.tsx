"use client";

import { CSSProperties } from "react";
import { GridTile } from "@/types/game-types";
import WordleTile from "./wordle-tile";

type WordleGridProps = {
  gridRows: GridTile[][];
  error: string | null;
  wordLength: number;
};

const WordleGrid = ({ gridRows, error, wordLength }: WordleGridProps) => {
  const tileGapRem = 0.375;

  return (
    <div
      className="flex w-full flex-col gap-3 sm:gap-4"
      style={
        {
          "--cols": wordLength,
          "--tile-gap": `${tileGapRem}rem`,
          "--tile-size": `min(3.5rem, calc((100vw - 2rem - (${wordLength} - 1) * var(--tile-gap)) / ${wordLength}))`,
        } as CSSProperties
      }
    >
      <div className="flex flex-col items-center gap-(--tile-gap)">
        {gridRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-(--tile-gap)">
            {row.map((tile, colIndex) => (
              <WordleTile
                key={`${rowIndex}-${colIndex}`}
                letter={tile.letter}
                display={tile.display}
                style={{
                  animation:
                    tile.display === "correct"
                      ? "right-answer-wave 0.45s ease-out forwards"
                      : undefined,
                  animationDelay:
                    tile.display === "correct"
                      ? `${colIndex * 90}ms`
                      : undefined,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {error ? (
        <p className="text-center text-xs text-red-600 sm:text-sm">{error}</p>
      ) : null}
    </div>
  );
};

export default WordleGrid;
