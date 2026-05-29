import { getDailyDate, getDailyWordLength } from "@/lib/daily-word";
import { connection } from "next/server";
import WordleLayout from "./wordle-layout";

const DailyGame = async () => {
  await connection();

  const wordLength = getDailyWordLength();
  const date = getDailyDate();

  return <WordleLayout date={date} wordLength={wordLength} />;
};

export default DailyGame;
