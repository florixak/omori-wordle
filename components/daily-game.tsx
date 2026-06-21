import { getStreak } from "@/actions/stats-actions";
import { loadTodayCompletedGameState } from "@/actions/game-actions";
import { auth } from "@/auth";
import {
  getDailyDate,
  getDailyWordLength,
  getDayNumber,
} from "@/lib/daily-word";
import { connection } from "next/server";
import { headers } from "next/headers";
import WordleLayout from "./wordle-layout";

const DailyGame = async () => {
  await connection();

  const wordLength = getDailyWordLength();
  const date = getDailyDate();
  const dayNumber = getDayNumber();
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = Boolean(session);
  const streak = isLoggedIn ? await getStreak() : 0;
  const savedGame = session
    ? await loadTodayCompletedGameState(session.user.id)
    : undefined;

  return (
    <WordleLayout
      date={date}
      wordLength={wordLength}
      dayNumber={dayNumber}
      streak={streak}
      isLoggedIn={isLoggedIn}
      savedGame={savedGame}
    />
  );
};

export default DailyGame;
