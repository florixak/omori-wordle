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
import ProfileDialog from "./dialog/profile-dialog";
import OmoriLoginDialog from "./dialog/login-dialog";
import OmoriButton from "./omori/omori-button";
import { resolveErrorMessage } from "@/lib/errors";
import { omoriToast } from "@/lib/omori-toast";

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showFriendsDialog, setShowFriendsDialog] = useState(false);
  const [showLeaderboardDialog, setShowLeaderboardDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      omoriToast.success("Logged out");
    } catch (error) {
      omoriToast.error(resolveErrorMessage(error));
    }
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 gap-2 md:gap-4">
      <div className="flex items-center gap-2 flex-wrap justify-start">
        <OmoriButton
          className="py-0"
          aria-label="Stats"
          onClick={() => setShowStatsDialog(true)}
        >
          <BarChart size={24} />
        </OmoriButton>
        {session ? (
          <OmoriButton
            className="py-0"
            aria-label="Friends leaderboard"
            onClick={() => setShowLeaderboardDialog(true)}
          >
            <Trophy size={24} />
          </OmoriButton>
        ) : null}
        <OmoriButton
          className="py-0"
          aria-label="Hint"
          onClick={() => setShowHintDialog(true)}
        >
          <Lightbulb size={24} />
        </OmoriButton>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {session ? (
          <>
            <span className="font-pixel text-xs sm:text-sm">
              {session.user.name}
            </span>
            <button
              onClick={() => setShowProfileDialog(true)}
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
            <OmoriButton
              className="py-0"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <LogOut size={24} />
            </OmoriButton>

            <OmoriButton
              className="py-0"
              aria-label="Friends"
              onClick={() => setShowFriendsDialog(true)}
            >
              <Users size={24} />
            </OmoriButton>
          </>
        ) : (
          <OmoriButton
            className="py-0"
            aria-label="Login"
            onClick={() => setShowLoginDialog(true)}
          >
            <User size={24} />
          </OmoriButton>
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
      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </header>
  );
};

export default Header;
