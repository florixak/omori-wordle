"use client";

import { getHint, processGuess, submitGame } from "@/actions/game-actions";
import { getGuessWords } from "@/lib/game-state-utils";
import { getKeyboardStateFromGuesses } from "@/lib/game-logic";
import { buildGridRows } from "@/lib/grid-view";
import {
  getServerGameSnapshot,
  notifyGameStorageChange,
  readStoredGameState,
  subscribeToGameStorage,
} from "@/lib/local-game-state";
import { GameState, GridTile, TileEvaluation } from "@/types/game-types";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { GAME_STORAGE_KEY, MAX_ATTEMPTS } from "@/constants";
import { authClient } from "@/lib/auth-client";

type UseGameProps = {
  date: string;
  wordLength: number;
};

type UseGameStateReturn = {
  state: GameState;
  gridRows: GridTile[][];
  keyboardState: Record<string, TileEvaluation>;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => Promise<void>;
  requestHint: () => Promise<string | null>;
  error: string | null;
  isSubmitting: boolean;
};

const useGameState = ({
  date,
  wordLength,
}: UseGameProps): UseGameStateReturn => {
  const { data: session } = authClient.useSession();
  const storage = useLocalStorage<GameState>(GAME_STORAGE_KEY);

  const state = useSyncExternalStore(
    subscribeToGameStorage,
    () => readStoredGameState(date, wordLength),
    () => getServerGameSnapshot(date, wordLength),
  );

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stateRef = useRef(state);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const updateGameState = (updater: (prev: GameState) => GameState) => {
    const next = updater(readStoredGameState(date, wordLength));
    storage.setItem(next);
    notifyGameStorageChange();
  };

  const addLetter = (letter: string) => {
    setError(null);
    updateGameState((prev) => {
      if (prev.status !== "playing") return prev;
      if (letter.length !== 1) return prev;
      if (prev.currentInput.length >= prev.wordLength) return prev;

      return {
        ...prev,
        currentInput: prev.currentInput + letter.toUpperCase(),
      };
    });
  };

  const removeLetter = () => {
    setError(null);
    updateGameState((prev) => {
      if (prev.status !== "playing") return prev;
      if (prev.currentInput.length === 0) return prev;

      return {
        ...prev,
        currentInput: prev.currentInput.slice(0, -1),
      };
    });
  };

  const submitGuess = async () => {
    if (isSubmittingRef.current) return;

    const snapshot = stateRef.current;

    if (snapshot.status !== "playing") return;
    if (snapshot.currentInput.length !== snapshot.wordLength) {
      setError("Not enough letters");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    const submittedInput = snapshot.currentInput;
    const previousGuesses = getGuessWords(snapshot.submittedGuesses);
    const previousSignature = snapshot.historySignature;

    try {
      const response = await processGuess(
        submittedInput,
        previousGuesses,
        snapshot.date,
        previousSignature,
      );

      if (!response.ok) {
        if (
          response.error === "Progress out of sync — local progress cleared."
        ) {
          storage.removeItem();
          notifyGameStorageChange();
          setError(response.error);
          return;
        }

        if (response.error === "Invalid game state") {
          storage.removeItem();
          notifyGameStorageChange();
          setError("Invalid game state — local progress cleared.");
          return;
        }

        setError(response.error);
        return;
      }

      const now = Date.now();
      const startedAt = snapshot.startedAt ?? now;
      const allGuesses = [...previousGuesses, response.guess];

      updateGameState((prev) => ({
        ...prev,
        submittedGuesses: [
          ...prev.submittedGuesses,
          {
            word: response.guess,
            evaluations: response.evaluations,
          },
        ],
        currentInput: "",
        startedAt: prev.startedAt ?? now,
        status: response.status,
        historySignature: response.signature,
      }));

      if (
        session &&
        (response.status === "won" || response.status === "lost")
      ) {
        const saveResult = await submitGame({
          date: snapshot.date,
          guesses: allGuesses,
          startedAt,
          historySignature: response.signature,
        });

        if (!saveResult.ok) {
          setError(saveResult.error);
        }
      }
    } catch {
      setError("Unable to submit guess right now. Please try again.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const requestHint = async (): Promise<string | null> => {
    const snapshot = stateRef.current;

    if (snapshot.hintUsed) {
      return null;
    }

    try {
      const { hint } = await getHint();

      updateGameState((prev) => ({
        ...prev,
        hintUsed: true,
      }));

      return hint;
    } catch {
      setError("Unable to load hint right now. Please try again.");
      return null;
    }
  };

  useHotkey("Enter", () => {
    void submitGuess();
  });

  const gridRows = buildGridRows(
    state.submittedGuesses,
    state.currentInput,
    state.wordLength,
    MAX_ATTEMPTS,
  );
  const keyboardState = getKeyboardStateFromGuesses(state.submittedGuesses);

  return {
    state,
    gridRows,
    keyboardState,
    addLetter,
    removeLetter,
    submitGuess,
    requestHint,
    error,
    isSubmitting,
  };
};

export default useGameState;
