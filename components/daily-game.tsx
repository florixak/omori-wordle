import { getStreak } from "@/actions/stats-actions";
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

  return (
    <WordleLayout
      date={date}
      wordLength={wordLength}
      dayNumber={dayNumber}
      streak={streak}
      isLoggedIn={isLoggedIn}
    />
  );
};

export default DailyGame;
