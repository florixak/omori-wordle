import { getDailyDate, getDailyWordLength } from "@/lib/daily-word";
import { connection } from "next/server";
import WordleGrid from "./wordle-grid";

const DailyGame = async () => {
  await connection();

  const wordLength = getDailyWordLength();
  const date = getDailyDate();

  return (
    <>
      <WordleGrid date={date} wordLength={wordLength} />
    </>
  );
};

export default DailyGame;
