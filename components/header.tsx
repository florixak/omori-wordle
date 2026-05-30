"use client";

import { useGameActions } from "@/components/game-actions-provider";
import { useGameHintState } from "@/hooks/use-game-hint-state";
import HintDialog from "@/components/hint-dialog";
import { authClient } from "@/lib/auth-client";
import { BarChart, Lightbulb, LogOut, User } from "lucide-react";
import { useState } from "react";
import OmoriLoginDialog from "./login-dialog";
import WordleButton from "./wordle-button";

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  const gameActions = useGameActions();
  const { hintUsed, hint } = useGameHintState();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  const handleRevealHint = async () => {
    if (!gameActions) {
      return;
    }

    setIsHintLoading(true);
    try {
      await gameActions.requestHint();
    } catch {
      // optionally surface a user-facing error state here
    } finally {
      setIsHintLoading(false);
    }
  };

  const hintAvailable = gameActions?.isAvailable ?? false;

  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 gap-2 md:gap-4">
      <div className="flex items-center gap-2">
        <WordleButton className="py-0">
          <BarChart size={24} />
        </WordleButton>
        <WordleButton
          className="py-0"
          disabled={!hintAvailable}
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
          <WordleButton className="py-0" onClick={handleLogout}>
            <LogOut size={24} />
          </WordleButton>
        ) : (
          <WordleButton
            className="py-0"
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
      <HintDialog
        open={showHintDialog}
        onOpenChange={setShowHintDialog}
        hint={hint}
        hintUsed={hintUsed}
        onRevealHint={handleRevealHint}
        isLoading={isHintLoading}
      />
    </header>
  );
};

export default Header;
