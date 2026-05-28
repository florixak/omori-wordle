"use client";

import useGameState from "@/hooks/use-game-state";
import WordleTile from "./wordle-tile";

type WordleGridProps = {
  date: string;
  wordLength: number;
};

const WordleGrid = ({ date, wordLength }: WordleGridProps) => {
  const { state, gridRows, error } = useGameState({ date, wordLength });

  return (
    <div className="flex flex-col gap-2" data-state={state.status}>
      {gridRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((tile, colIndex) => (
            <WordleTile
              key={`${rowIndex}-${colIndex}`}
              letter={tile.letter}
              display={tile.display}
            />
          ))}
        </div>
      ))}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default WordleGrid;
