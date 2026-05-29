"use client";

import { processGuess } from "@/actions/game-actions";
import { getGuessWords, loadStoredGameState } from "@/lib/game-state-utils";
import { getKeyboardStateFromGuesses } from "@/lib/game-logic";
import { buildGridRows } from "@/lib/grid-view";
import { createInitialState, GAME_STORAGE_KEY } from "@/lib/local-game-state";
import { GameState, GridTile, TileEvaluation } from "@/types/game-types";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { MAX_ATTEMPTS } from "@/constants";

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
  error: string | null;
  isSubmitting: boolean;
};

const useGameState = ({
  date,
  wordLength,
}: UseGameProps): UseGameStateReturn => {
  const storage = useLocalStorage<GameState>(GAME_STORAGE_KEY);

  const [state, setState] = useState<GameState>(() => {
    const storedState = loadStoredGameState(
      storage.getItem(),
      date,
      wordLength,
    );

    if (storedState) {
      return storedState;
    }

    return createInitialState(date, wordLength);
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stateRef = useRef(state);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const persistState = (updatedState: GameState) => {
    storage.setItem(updatedState);
    return updatedState;
  };

  const addLetter = (letter: string) => {
    setError(null);
    setState((prev) => {
      if (prev.status !== "playing") return prev;
      if (letter.length !== 1) return prev;
      if (prev.currentInput.length >= prev.wordLength) return prev;

      return persistState({
        ...prev,
        currentInput: prev.currentInput + letter.toUpperCase(),
      });
    });
  };

  const removeLetter = () => {
    setError(null);
    setState((prev) => {
      if (prev.status !== "playing") return prev;
      if (prev.currentInput.length === 0) return prev;

      return persistState({
        ...prev,
        currentInput: prev.currentInput.slice(0, -1),
      });
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
          response.error === "Invalid game state" ||
          response.error === "Progress out of sync — local progress cleared."
        ) {
          storage.removeItem();
          setState(createInitialState(date, wordLength));
          setError("Progress out of sync — local progress cleared.");
          return;
        }

        setError(response.error);
        return;
      }

      const now = Date.now();
      setState((prev) =>
        persistState({
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
        }),
      );
    } catch {
      setError("Unable to submit guess right now. Please try again.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
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
    error,
    isSubmitting,
  };
};

export default useGameState;
