import DailyGame from "@/components/daily-game";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<p>Loading today&apos;s puzzle…</p>}>
      <DailyGame />
    </Suspense>
  );
}
