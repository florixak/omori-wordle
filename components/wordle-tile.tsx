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
      className={`
        w-14 h-14 flex items-center justify-center
        ${getBgColor()}
        transition-all duration-200
        shadow-[3px_3px_0px_var(--omori-shadow)]
        border-2 border-black
        relative
      `}
      style={{
        fontFamily: "var(--font-pixel)",
        imageRendering: "pixelated",
        transitionDelay: `${delay}ms`,
      }}
    >
      <span className="text-2xl uppercase select-none">{letter}</span>
      {display !== "empty" ? (
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
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
