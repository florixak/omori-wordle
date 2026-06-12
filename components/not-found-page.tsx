import React from "react";
import WordleTile from "./wordle-tile";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center overflow-x-hidden px-4 py-6 sm:px-6">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
        <div className="flex gap-2 sm:gap-3" aria-hidden="true">
          <WordleTile letter="4" display="absent" />
          <WordleTile letter="0" display="absent" />
          <WordleTile letter="4" display="absent" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="font-pixel text-2xl sm:text-3xl">
            Something forgotten...
          </h1>
          <p className="font-pixel text-xs text-muted-foreground sm:text-sm">
            This page doesn&apos;t exist in HEADSPACE.
          </p>
        </div>

        <div className="omori-border w-full max-w-sm bg-background p-4">
          <p className="text-sm leading-relaxed sm:text-base">
            The path you followed led somewhere empty. Maybe it was never there
            to begin with.
          </p>
        </div>

        <Link
          href="/"
          className={cn(
            "omori-border omori-press font-pixel",
            "inline-flex h-10 w-full max-w-sm items-center justify-center rounded",
            "bg-primary text-primary-foreground",
            "text-[0.825rem] leading-none sm:text-base",
            "hover:bg-primary/80 hover:text-primary-foreground/80",
          )}
        >
          Return to HEADSPACE
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
