"use client";

import FriendsDialog from "@/components/dialog/friends-dialog";
import StatsDialog from "@/components/dialog/stats-dialog";
import OmoriLoginDialog from "@/components/dialog/login-dialog";
import WordleButton from "@/components/wordle-button";
import { authClient } from "@/lib/auth-client";
import { LogOut, User, Users } from "lucide-react";
import { useState } from "react";

const HeaderProfileActions = () => {
  const { data: session, isPending } = authClient.useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showFriendsDialog, setShowFriendsDialog] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        {session ? (
          <span className="font-pixel text-xs sm:text-sm">
            {session.user.name}
          </span>
        ) : null}
        {session ? (
          <>
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
        ) : null}
        <WordleButton
          className="py-0"
          aria-label={session ? "User profile" : "Login"}
          onClick={
            session
              ? () => setShowStatsDialog(true)
              : () => setShowLoginDialog(true)
          }
        >
          <User size={24} />
        </WordleButton>
      </div>
      <OmoriLoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
        isLoading={isPending}
      />
      <StatsDialog open={showStatsDialog} onOpenChange={setShowStatsDialog} />
      <FriendsDialog
        open={showFriendsDialog}
        onOpenChange={setShowFriendsDialog}
      />
    </>
  );
};

export default HeaderProfileActions;
