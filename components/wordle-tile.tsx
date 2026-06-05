"use client";

import { cn } from "@/lib/utils";
import { TileDisplayState } from "@/types/game-types";

interface WordleTileProps extends React.HTMLAttributes<HTMLDivElement> {
  letter: string;
  display: TileDisplayState;
  delay?: number;
}

const getTileClasses = (display: TileDisplayState): string => {
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

const WordleTile = ({
  letter,
  display,
  delay = 0,
  ...props
}: WordleTileProps) => {
  return (
    <div
      {...props}
      className={cn(
        "omori-border-lg font-pixel",
        "relative flex h-(--tile-size,3.5rem) w-(--tile-size,3.5rem) items-center justify-center transition-all duration-200 motion-safe:origin-[bottom_center] motion-safe:will-change-transform",
        getTileClasses(display),
      )}
      style={{
        imageRendering: "pixelated",
        transitionDelay: `${delay}ms`,
        ...props.style,
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
