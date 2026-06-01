"use client";

import HintDialog from "@/components/dialog/hint-dialog";
import { authClient } from "@/lib/auth-client";
import { BarChart, Lightbulb, LogOut, User } from "lucide-react";
import { useState } from "react";
import OmoriLoginDialog from "./dialog/login-dialog";
import WordleButton from "./wordle-button";
import StatsDialog from "./dialog/stats-dialog";

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

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
      <div className="flex items-center gap-2">
        <WordleButton
          className="py-0"
          aria-label="Stats"
          onClick={() => setShowStatsDialog(true)}
        >
          <BarChart size={24} />
        </WordleButton>
        <WordleButton
          className="py-0"
          aria-label="Hint"
          onClick={() => setShowHintDialog(true)}
        >
          <Lightbulb size={24} />
        </WordleButton>
      </div>
      <div className="flex items-center gap-2">
        {session ? (
          <span className="font-pixel text-xs sm:text-sm">
            {session.user.name}
          </span>
        ) : null}
        {session ? (
          <WordleButton
            className="py-0"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut size={24} />
          </WordleButton>
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
      <HintDialog open={showHintDialog} onOpenChange={setShowHintDialog} />
      <StatsDialog open={showStatsDialog} onOpenChange={setShowStatsDialog} />
    </header>
  );
};

export default Header;
