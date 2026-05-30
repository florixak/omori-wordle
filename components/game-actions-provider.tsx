"use client";

import { GameStatus } from "@/types/game-types";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type GameActions = {
  hintUsed: boolean;
  hint: string | null;
  status: GameStatus;
  requestHint: () => Promise<string | null>;
};

type GameActionsContextValue = {
  actions: GameActions | null;
  setActions: (actions: GameActions | null) => void;
};

const GameActionsContext = createContext<GameActionsContextValue | null>(null);

export const GameActionsProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<GameActions | null>(null);
  const value = useMemo(
    () => ({
      actions,
      setActions,
    }),
    [actions],
  );

  return (
    <GameActionsContext.Provider value={value}>
      {children}
    </GameActionsContext.Provider>
  );
};

export const useGameActions = (): GameActions | null => {
  const context = useContext(GameActionsContext);
  return context?.actions ?? null;
};

export const useRegisterGameActions = (actions: GameActions | null): void => {
  const setActions = useContext(GameActionsContext)?.setActions;

  useEffect(() => {
    if (!setActions) {
      return;
    }

    setActions(actions);
  }, [setActions, actions]);

  useEffect(() => {
    if (!setActions) {
      return;
    }

    return () => {
      setActions(null);
    };
  }, [setActions]);
};
