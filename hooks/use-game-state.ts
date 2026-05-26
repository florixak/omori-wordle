"use client";

import { processGuess } from "@/actions/game-actions";
import {
  getGuessResults,
  getGuessWords,
  isStoredGameStateValid,
  parseStoredGameState,
} from "@/lib/game-state-utils";
import { getKeyboardStateFromResults } from "@/lib/game-logic";
import { createInitialState, GAME_STORAGE_KEY } from "@/lib/local-game-state";
import { GameState, GuessResult, TileState } from "@/types/game-types";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "./use-local-storage";

type UseGameProps = {
  date: string;
  wordLength: number;
};

type UseGameStateReturn = {
  state: GameState;
  results: GuessResult[];
  keyboardState: Record<string, TileState>;
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
    const storedState = parseStoredGameState(storage.getItem());

    if (storedState && isStoredGameStateValid(storedState, date, wordLength)) {
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

    try {
      const response = await processGuess(submittedInput, previousGuesses);

      if (!response.ok) {
        setError(response.error);
        return;
      }

      const now = Date.now();
      setState((prev) =>
        persistState({
          ...prev,
          submittedGuesses: [
            ...prev.submittedGuesses,
            { word: response.guess, result: response.result },
          ],
          currentInput: "",
          startedAt: prev.startedAt ?? now,
          status: response.status,
        }),
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  useHotkey("Enter", () => {
    void submitGuess();
  });

  const results = getGuessResults(state.submittedGuesses);
  const keyboardState = getKeyboardStateFromResults(results);

  return {
    state,
    results,
    keyboardState,
    addLetter,
    removeLetter,
    submitGuess,
    error,
    isSubmitting,
  };
};

export default useGameState;
