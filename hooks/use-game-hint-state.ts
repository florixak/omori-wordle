"use client";

import {
  getServerHintSnapshot,
  readStoredHintState,
  subscribeToGameStorage,
} from "@/lib/local-game-state";
import { useSyncExternalStore } from "react";

export const useGameHintState = () => {
  return useSyncExternalStore(
    subscribeToGameStorage,
    readStoredHintState,
    getServerHintSnapshot,
  );
};
