"use client";

import { processGuess } from "@/actions/game-actions";
import { getKeyboardStateFromResults } from "@/lib/game-logic";
import {
  createInitialState,
  GAME_STORAGE_KEY,
  isStateForToday,
} from "@/lib/local-game-state";
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

const hasStoredResults = (storedState: GameState): boolean =>
  storedState.guessResults.length === storedState.guesses.length;

const isStoredStateValid = (
  storedState: GameState,
  date: string,
  wordLength: number,
): boolean =>
  isStateForToday(storedState, date) &&
  storedState.wordLength === wordLength &&
  hasStoredResults(storedState);

const useGameState = ({
  date,
  wordLength,
}: UseGameProps): UseGameStateReturn => {
  const storage = useLocalStorage<GameState>(GAME_STORAGE_KEY);

  const [state, setState] = useState<GameState>(() => {
    const storedState = storage.getItem();

    if (storedState && isStoredStateValid(storedState, date, wordLength)) {
      return storedState;
    }

    return createInitialState(date, wordLength);
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const persistState = (next: GameState) => {
    storage.setItem(next);
    return next;
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
    if (isSubmitting) return;

    const current = stateRef.current;

    if (current.status !== "playing") return;
    if (current.currentInput.length !== current.wordLength) {
      setError("Not enough letters");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await processGuess(
        current.currentInput,
        current.guesses,
      );

      if (!response.ok) {
        setError(response.error);
        return;
      }

      const now = Date.now();
      setState((prev) =>
        persistState({
          ...prev,
          guesses: [...prev.guesses, response.guess],
          guessResults: [...prev.guessResults, response.result],
          currentInput: "",
          startedAt: prev.startedAt ?? now,
          status: response.status,
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useHotkey("Enter", () => {
    void submitGuess();
  });

  const keyboardState = getKeyboardStateFromResults(state.guessResults);

  return {
    state,
    results: state.guessResults,
    keyboardState,
    addLetter,
    removeLetter,
    submitGuess,
    error,
    isSubmitting,
  };
};

export default useGameState;
