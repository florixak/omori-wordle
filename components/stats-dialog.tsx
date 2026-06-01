"use client";

import { getStats } from "@/actions/stats-actions";
import type { UserStats } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { useEffect, useEffectEvent, useState } from "react";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "./omori/omori-dialog";
import WordleButton from "./wordle-button";
import { computeWinRate, formatGuessDistribution } from "@/lib/utils";
import GuessDistributionChart from "./guess-distribution-chart";
import StatCell from "./stat-cell";
import Image from "next/image";

type StatsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type SummaryGridProps = {
  stats: UserStats;
  userAvatar: string;
  userName: string;
};

const SummaryGrid = ({ stats, userAvatar, userName }: SummaryGridProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex justify-center items-center gap-2 ">
      <Image
        src={userAvatar}
        alt="User avatar"
        width={48}
        height={48}
        className="rounded-full"
      />
      <span className="font-pixel text-xs sm:text-sm">{userName}</span>
    </div>
    <div className="grid grid-cols-4 gap-2">
      <StatCell value={stats.gamesPlayed} label="Played" />
      <StatCell value={stats.gamesWon} label="Won" />
      <StatCell
        value={`${computeWinRate(stats.gamesPlayed, stats.gamesWon)}%`}
        label="Win %"
      />
      <StatCell value={stats.currentStreak} label="Streak" />
    </div>
    <div className="grid grid-cols-2 gap-2 border-2 border-black px-3 py-2">
      <StatCell value={stats.maxStreak} label="Max streak" />
      <StatCell value={stats.hintsUsed} label="Hints used" />
    </div>
  </div>
);

const StatsDialog = ({ open, onOpenChange }: StatsDialogProps) => {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setLoadingEvent = useEffectEvent((loading: boolean) => {
    setIsLoading(loading);
  });

  const setErrorEvent = useEffectEvent((nextError: string | null) => {
    setError(nextError);
  });

  const setStatsEvent = useEffectEvent((nextStats: UserStats | null) => {
    setStats(nextStats);
  });

  useEffect(() => {
    if (!open || !session) {
      return;
    }

    const fetchStats = async () => {
      try {
        setLoadingEvent(true);
        setErrorEvent(null);
        setStatsEvent(null);
        const nextStats = await getStats();
        setStatsEvent(nextStats);
      } catch (fetchError) {
        setErrorEvent(
          fetchError instanceof Error
            ? fetchError.message
            : "Failed to load stats",
        );
      } finally {
        setLoadingEvent(false);
      }
    };

    void fetchStats();
  }, [open, session]);

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  const rows = formatGuessDistribution(stats?.guessDistribution ?? {});
  const isEmpty = stats !== null && stats.gamesPlayed === 0;

  return (
    <OmoriDialog open={open} onOpenChange={onOpenChange}>
      <OmoriDialogContent className="max-w-sm">
        <OmoriDialogHeader>
          <OmoriDialogTitle>Statistics</OmoriDialogTitle>
          <OmoriDialogDescription>
            Your journey through HEADSPACE.
          </OmoriDialogDescription>
        </OmoriDialogHeader>

        <div className="flex flex-col gap-5">
          {isSessionPending ? (
            <p className="text-center text-[0.625rem] text-muted-foreground sm:text-xs">
              Loading…
            </p>
          ) : null}

          {!isSessionPending && !session ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <p className="text-[0.625rem] leading-relaxed sm:text-xs">
                Sign in with Discord to track wins, streaks, and guess
                distribution.
              </p>
              <WordleButton className="w-full" onClick={handleLogin}>
                Continue with Discord
              </WordleButton>
            </div>
          ) : null}

          {session && isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-14 animate-pulse border-2 border-black bg-[var(--omori-empty)]"
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-5 animate-pulse border-2 border-black bg-[var(--omori-empty)]"
                  />
                ))}
              </div>
            </div>
          ) : null}

          {session && !isLoading && error ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <p className="text-[0.625rem] text-destructive sm:text-xs">
                {error}
              </p>
              {/*<WordleButton
                className="w-full"
                onClick={() => void fetchStats()}
              >
                Try again
              </WordleButton>*/}
            </div>
          ) : null}

          {session && !isLoading && !error && stats ? (
            <>
              {isEmpty ? (
                <p className="text-center text-[0.625rem] leading-relaxed text-muted-foreground sm:text-xs">
                  Play your first puzzle to start building stats.
                </p>
              ) : null}
              <SummaryGrid
                stats={stats}
                userAvatar={
                  session.user.image && session.user.image.trim().length > 0
                    ? session.user.image
                    : "/avatars/sunny.png"
                }
                userName={session.user.name}
              />
              <div className="border-t-2 border-black pt-4">
                <GuessDistributionChart rows={rows} />
              </div>
            </>
          ) : null}
        </div>

        <OmoriDialogFooter className="gap-3 pt-2">
          <p className="text-center text-[0.625rem] leading-relaxed text-muted-foreground sm:text-xs">
            Every day you return, HEADSPACE grows stronger…
          </p>
          <WordleButton className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </WordleButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default StatsDialog;
