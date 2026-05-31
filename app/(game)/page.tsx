import DailyGame from "@/components/daily-game";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = createPageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

export default function Home() {
  return (
    <Suspense fallback={<p>Loading today&apos;s puzzle…</p>}>
      <DailyGame />
    </Suspense>
  );
}
