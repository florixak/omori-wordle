"use client";

import LeaderboardSection from "@/components/friends/leaderboard-section";
import OmoriButton from "@/components/omori/omori-button";
import useLeaderboard from "@/hooks/use-leaderboard";
import { resolveErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "@/components/omori/omori-dialog";

type LeaderboardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse border-2 border-black bg-(--omori-empty)",
      className,
    )}
  />
);

const LeaderboardDialog = ({ open, onOpenChange }: LeaderboardDialogProps) => {
  const {
    session,
    isSessionPending,
    handleOpenChange,
    handleLogin,
    isLeaderboardPending,
    error,
    leaderboard,
    refetch,
  } = useLeaderboard({ open, onOpenChange });

  return (
    <OmoriDialog open={open} onOpenChange={handleOpenChange}>
      <OmoriDialogContent className="max-h-[85dvh] max-w-sm overflow-y-auto">
        <OmoriDialogHeader>
          <OmoriDialogTitle>Leaderboard</OmoriDialogTitle>
          <OmoriDialogDescription>
            See how you and your friends did on today&apos;s puzzle.
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
                Sign in with Discord to view the friends-only daily leaderboard.
              </p>
              <OmoriButton className="w-full" onClick={handleLogin}>
                Continue with Discord
              </OmoriButton>
            </div>
          ) : null}

          {session && isLeaderboardPending ? (
            <div className="flex flex-col gap-4">
              <SkeletonBlock className="h-6" />
              <SkeletonBlock className="h-24" />
            </div>
          ) : null}

          {session && !isLeaderboardPending && error ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <p className="text-[0.625rem] text-destructive sm:text-xs">
                {resolveErrorMessage(error)}
              </p>
              <OmoriButton className="w-full" onClick={() => void refetch()}>
                Try again
              </OmoriButton>
            </div>
          ) : null}

          {session && !isLeaderboardPending && !error && leaderboard ? (
            <LeaderboardSection
              entries={leaderboard.entries}
              date={leaderboard.date}
            />
          ) : null}
        </div>

        <OmoriDialogFooter className="gap-3 pt-2">
          <OmoriButton
            className="w-full"
            onClick={() => handleOpenChange(false)}
          >
            Close
          </OmoriButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default LeaderboardDialog;
