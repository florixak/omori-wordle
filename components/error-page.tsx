"use client";

import OmoriButton from "@/components/omori/omori-button";
import WordleTile from "@/components/wordle-tile";
import { cn } from "@/lib/utils";
import Link from "next/link";

type ErrorPageProps = {
  title?: string;
  description?: string;
  message?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
};

const ErrorPage = ({
  title = "Something went wrong...",
  description = "HEADSPACE encountered an error.",
  message = "Something interrupted your journey. You can try again, or return to the daily puzzle.",
  error,
  reset,
}: ErrorPageProps) => {
  const isDev = process.env.NODE_ENV === "development";
  const detail = isDev ? error?.message : undefined;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center overflow-x-hidden px-4 py-6 sm:px-6">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
        <div className="flex gap-2 sm:gap-3" aria-hidden="true">
          <WordleTile letter="?" display="present" />
          <WordleTile letter="!" display="present" />
          <WordleTile letter="?" display="present" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="font-pixel text-2xl sm:text-3xl">{title}</h1>
          <p className="font-pixel text-xs text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>

        <div className="omori-border w-full max-w-sm bg-background p-4 text-left">
          <p className="text-sm leading-relaxed sm:text-base">{message}</p>
          {detail ? (
            <p className="mt-3 font-mono text-[0.625rem] leading-relaxed text-destructive sm:text-xs">
              {detail}
            </p>
          ) : null}
          {isDev && error?.digest ? (
            <p className="mt-2 font-mono text-[0.625rem] text-muted-foreground sm:text-xs">
              Digest: {error.digest}
            </p>
          ) : null}
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          {reset ? (
            <OmoriButton
              type="button"
              className={cn("w-full", "omori-button-default")}
              onClick={reset}
            >
              Try again
            </OmoriButton>
          ) : null}

          <Link
            href="/"
            className={cn(
              "omori-border omori-press font-pixel",
              "inline-flex h-10 w-full items-center justify-center rounded",
              reset
                ? "bg-background text-foreground hover:bg-muted hover:text-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground/80",
              "text-[0.825rem] leading-none sm:text-base",
            )}
          >
            Return to HEADSPACE
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
