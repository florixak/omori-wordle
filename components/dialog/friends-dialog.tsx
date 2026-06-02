"use client";

import {
  cancelOutgoingRequest,
  removeFriend,
  respondToFriendRequest,
} from "@/actions/friends-actions";
import AddFriendSection from "@/components/friends/add-friend-section";
import FriendsListSection from "@/components/friends/friends-list-section";
import LeaderboardSection from "@/components/friends/leaderboard-section";
import PendingRequestsSection from "@/components/friends/pending-requests-section";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "@/components/omori/omori-dialog";
import WordleButton from "@/components/wordle-button";
import useFriends from "@/hooks/use-friends";
import { cn } from "@/lib/utils";

type FriendsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-pixel text-[0.625rem] uppercase tracking-wide sm:text-xs">
    {children}
  </h3>
);

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "animate-pulse border-2 border-black bg-(--omori-empty)",
      className,
    )}
  />
);

const FriendsDialog = ({ open, onOpenChange }: FriendsDialogProps) => {
  const {
    session,
    isSessionPending,
    handleOpenChange,
    handleLogin,
    runAction,
    isLoading,
    error,
    overview,
    isActionBusy,
    actionMessage,
    reloadOverview,
    handleSendRequest,
  } = useFriends({ open, onOpenChange });

  return (
    <OmoriDialog open={open} onOpenChange={handleOpenChange}>
      <OmoriDialogContent className="max-h-[85dvh] max-w-sm overflow-y-auto">
        <OmoriDialogHeader>
          <OmoriDialogTitle>Friends</OmoriDialogTitle>
          <OmoriDialogDescription>
            Compare today&apos;s puzzle with people you trust.
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
                Sign in with Discord to add friends and view the daily
                leaderboard.
              </p>
              <WordleButton className="w-full" onClick={handleLogin}>
                Continue with Discord
              </WordleButton>
            </div>
          ) : null}

          {session && isLoading ? (
            <div className="flex flex-col gap-4">
              <SkeletonBlock className="h-16" />
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-20" />
            </div>
          ) : null}

          {session && !isLoading && error ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <p className="text-[0.625rem] text-destructive sm:text-xs">
                {error}
              </p>
              <WordleButton
                className="w-full"
                onClick={() => void reloadOverview()}
              >
                Try again
              </WordleButton>
            </div>
          ) : null}

          {session && !isLoading && !error && overview ? (
            <>
              <PendingRequestsSection
                requests={overview.pendingRequests}
                isBusy={isActionBusy}
                onRespond={(requestId, action) =>
                  void runAction(() =>
                    respondToFriendRequest(requestId, action),
                  )
                }
                onCancel={(requestId) =>
                  void runAction(() => cancelOutgoingRequest(requestId))
                }
              />
              <LeaderboardSection
                entries={overview.leaderboard}
                date={overview.date}
              />
              <FriendsListSection
                friends={overview.friends}
                isBusy={isActionBusy}
                onRemove={(userId) =>
                  void runAction(() => removeFriend(userId))
                }
              />
              <AddFriendSection
                isBusy={isActionBusy}
                onSendRequest={handleSendRequest}
              />
            </>
          ) : null}

          {actionMessage ? (
            <p className="text-center text-[0.625rem] text-muted-foreground sm:text-xs">
              {actionMessage}
            </p>
          ) : null}
        </div>

        <OmoriDialogFooter className="gap-3 pt-2">
          <WordleButton
            className="w-full"
            onClick={() => handleOpenChange(false)}
          >
            Close
          </WordleButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default FriendsDialog;
