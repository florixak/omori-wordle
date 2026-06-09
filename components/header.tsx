"use client";

import HintDialog from "@/components/dialog/hint-dialog";
import HeaderProfileActions from "@/components/header-profile-actions";
import LeaderboardDialog from "@/components/dialog/leaderboard-dialog";
import StatsDialog from "@/components/dialog/stats-dialog";
import { authClient } from "@/lib/auth-client";
import { BarChart, Lightbulb, Trophy } from "lucide-react";
import { useState } from "react";
import WordleButton from "@/components/wordle-button";

const Header = () => {
  const { data: session } = authClient.useSession();
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showLeaderboardDialog, setShowLeaderboardDialog] = useState(false);

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
      <HeaderProfileActions />
      <HintDialog open={showHintDialog} onOpenChange={setShowHintDialog} />
      <StatsDialog open={showStatsDialog} onOpenChange={setShowStatsDialog} />
      <LeaderboardDialog
        open={showLeaderboardDialog}
        onOpenChange={setShowLeaderboardDialog}
      />
    </header>
  );
};

export default Header;
