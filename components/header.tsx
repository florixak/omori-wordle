"use client";

import FriendsDialog from "@/components/dialog/friends-dialog";
import HintDialog from "@/components/dialog/hint-dialog";
import LeaderboardDialog from "@/components/dialog/leaderboard-dialog";
import StatsDialog from "@/components/dialog/stats-dialog";
import { authClient } from "@/lib/auth-client";
import { getAvatarSrc } from "@/lib/friend-utils";
import { BarChart, Lightbulb, LogOut, Trophy, User, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AvatarsDialog from "./dialog/avatars-dialog";
import OmoriLoginDialog from "./dialog/login-dialog";
import WordleButton from "./wordle-button";

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showFriendsDialog, setShowFriendsDialog] = useState(false);
  const [showLeaderboardDialog, setShowLeaderboardDialog] = useState(false);
  const [showAvatarsDialog, setShowAvatarsDialog] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 gap-2 md:gap-4">
      <div className="flex items-center gap-2 flex-wrap justify-start">
        <WordleButton
          className="py-0"
          aria-label="Stats"
          onClick={() => setShowStatsDialog(true)}
        >
          <BarChart size={24} />
        </WordleButton>
        {session ? (
          <WordleButton
            className="py-0"
            aria-label="Friends leaderboard"
            onClick={() => setShowLeaderboardDialog(true)}
          >
            <Trophy size={24} />
          </WordleButton>
        ) : null}
        <WordleButton
          className="py-0"
          aria-label="Hint"
          onClick={() => setShowHintDialog(true)}
        >
          <Lightbulb size={24} />
        </WordleButton>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {session ? (
          <>
            <span className="font-pixel text-xs sm:text-sm">
              {session.user.name}
            </span>
            <button
              onClick={() => setShowAvatarsDialog(true)}
              className="p-0 cursor-pointer"
            >
              <Image
                src={getAvatarSrc(session.user.image ?? null)}
                alt={`${session.user.name}'s avatar`}
                width={48}
                height={48}
                loading="lazy"
                className="size-10 shrink-0 rounded border border-black"
              />
            </button>
            <WordleButton
              className="py-0"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut size={24} />
            </WordleButton>

            <WordleButton
              className="py-0"
              aria-label="Friends"
              onClick={() => setShowFriendsDialog(true)}
            >
              <Users size={24} />
            </WordleButton>
          </>
        ) : (
          <WordleButton
            className="py-0"
            aria-label="Login"
            onClick={() => setShowLoginDialog(true)}
          >
            <User size={24} />
          </WordleButton>
        )}
      </div>
      <OmoriLoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
        isLoading={isPending}
      />
      <HintDialog open={showHintDialog} onOpenChange={setShowHintDialog} />
      <StatsDialog open={showStatsDialog} onOpenChange={setShowStatsDialog} />
      <FriendsDialog
        open={showFriendsDialog}
        onOpenChange={setShowFriendsDialog}
      />
      <LeaderboardDialog
        open={showLeaderboardDialog}
        onOpenChange={setShowLeaderboardDialog}
      />
      <AvatarsDialog
        open={showAvatarsDialog}
        onOpenChange={setShowAvatarsDialog}
      />
    </header>
  );
};

export default Header;
