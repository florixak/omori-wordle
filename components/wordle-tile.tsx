"use client";

import { omoriBorderLg, omoriFont } from "@/lib/omori-styles";
import { cn } from "@/lib/utils";
import { TileDisplayState } from "@/types/game-types";

interface WordleTileProps {
  letter: string;
  display: TileDisplayState;
  delay?: number;
}

const WordleTile = ({ letter, display, delay = 0 }: WordleTileProps) => {
  const getBgColor = () => {
    switch (display) {
      case "correct":
        return "bg-[var(--omori-correct)] text-black";
      case "present":
        return "bg-[var(--omori-present)] text-black";
      case "absent":
        return "bg-[var(--omori-absent)] text-white";
      case "active":
        return "bg-white border-2 border-[var(--omori-border)]";
      default:
        return "bg-white border border-gray-300";
    }
  };

  return (
    <div
      className={cn(
        omoriBorderLg,
        omoriFont,
        "relative flex h-[var(--tile-size,3.5rem)] w-[var(--tile-size,3.5rem)] items-center justify-center transition-all duration-200",
        getBgColor(),
      )}
      style={{
        imageRendering: "pixelated",
        transitionDelay: `${delay}ms`,
      }}
    >
      <span
        className="select-none uppercase leading-none"
        style={{ fontSize: "calc(var(--tile-size, 3.5rem) * 0.45)" }}
      >
        {letter}
      </span>
      {display !== "empty" ? (
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.1) 2px,
              rgba(0,0,0,0.1) 4px
            )`,
          }}
        />
      ) : null}
    </div>
  );
};

export default WordleTile;
