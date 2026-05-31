type WordleTitleProps = {
  streak: number;
  isLoggedIn: boolean;
};

const WordleTitle = ({ streak, isLoggedIn }: WordleTitleProps) => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl">
        Omori Wordle
      </h1>
      {isLoggedIn ? (
        <p className="font-pixel text-xs sm:text-sm">
          Days in HEADSPACE: {streak}
        </p>
      ) : (
        <p className="font-pixel text-xs text-muted-foreground sm:text-sm">
          Login to see your streak
        </p>
      )}
    </div>
  );
};

export default WordleTitle;
