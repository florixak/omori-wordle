"use client";

import { useEffect } from "react";

export const useGameLostTheme = (isLost: boolean) => {
  useEffect(() => {
    if (isLost) {
      document.body.dataset.gameLost = "true";
    } else {
      delete document.body.dataset.gameLost;
    }

    return () => {
      delete document.body.dataset.gameLost;
    };
  }, [isLost]);
};
