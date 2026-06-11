"use client";

import StatsDialog from "@/components/dialog/stats-dialog";
import AddFriendSection from "@/components/friends/add-friend-section";
import FriendsListSection from "@/components/friends/friends-list-section";
import PendingRequestsSection from "@/components/friends/pending-requests-section";
import WordleButton from "@/components/wordle-button";
import useFriends from "@/hooks/use-friends";
import { resolveErrorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "../omori/omori-dialog";

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
  const [statsUserId, setStatsUserId] = useState<string | null>(null);

  const {
    session,
    isSessionPending,
    handleOpenChange,
    handleLogin,
    handleSendRequest,
    handleRespondToRequest,
    handleCancelOutgoingRequest,
    handleRemoveFriend,
    overview,
    isOverviewPending,
    isBusy,
    error,
    refetch,
  } = useFriends({ open, onOpenChange });

  return (
    <>
      <OmoriDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setStatsUserId(null);
          }
          handleOpenChange(nextOpen);
        }}
      >
        <OmoriDialogContent className="max-h-[85dvh] max-w-sm overflow-y-auto">
          <OmoriDialogHeader>
            <OmoriDialogTitle>Friends</OmoriDialogTitle>
            <OmoriDialogDescription>
              Add friends and manage requests.
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
                  Sign in with Discord to add friends and manage requests.
                </p>
                <WordleButton className="w-full" onClick={handleLogin}>
                  Continue with Discord
                </WordleButton>
              </div>
            ) : null}

            {session && isOverviewPending ? (
              <div className="flex flex-col gap-4">
                <SkeletonBlock className="h-16" />
                <SkeletonBlock className="h-24" />
                <SkeletonBlock className="h-20" />
              </div>
            ) : null}

            {session && !isOverviewPending && error ? (
              <div className="flex flex-col items-center gap-3 py-2 text-center">
                <p className="text-[0.625rem] text-destructive sm:text-xs">
                  {resolveErrorMessage(error)}
                </p>
                <WordleButton
                  className="w-full"
                  onClick={() => void refetch()}
                  disabled={isBusy}
                >
                  {isBusy ? "Retrying…" : "Try again"}
                </WordleButton>
              </div>
            ) : null}

            {session && !isOverviewPending && !error && overview ? (
              <>
                <PendingRequestsSection
                  requests={overview.pendingRequests}
                  isBusy={isBusy}
                  onRespond={(requestId, action) =>
                    handleRespondToRequest(requestId, action)
                  }
                  onCancel={(requestId) =>
                    handleCancelOutgoingRequest(requestId)
                  }
                />

                <FriendsListSection
                  friends={overview.friends}
                  isBusy={isBusy}
                  onRemove={(userId) => handleRemoveFriend(userId)}
                  onViewStats={(userId) => setStatsUserId(userId)}
                />
                <AddFriendSection
                  isBusy={isBusy}
                  onSendRequest={(username) => handleSendRequest(username)}
                />
              </>
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
      <StatsDialog
        open={open && statsUserId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setStatsUserId(null);
          }
        }}
        userId={statsUserId ?? undefined}
      />
    </>
  );
};

export default FriendsDialog;
