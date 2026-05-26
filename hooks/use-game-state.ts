import { processGuess } from "@/actions/game-actions";
import { getKeyboardStateFromResults } from "@/lib/game-logic";
import {
  createInitialState,
  GAME_STORAGE_KEY,
  isStateForToday,
} from "@/lib/local-game-state";
import { GameState, GuessResult, TileState } from "@/types/game-types";
import { useHotkey } from "@tanstack/react-hotkeys";
import { useState } from "react";
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
};

const hasStoredResults = (storedState: GameState): boolean =>
  storedState.guessResults.length === storedState.guesses.length;

const useGameState = ({
  date,
  wordLength,
}: UseGameProps): UseGameStateReturn => {
  const storage = useLocalStorage<GameState>(GAME_STORAGE_KEY);

  const [state, setState] = useState<GameState>(() => {
    const storedState = storage.getItem();

    if (
      storedState &&
      isStateForToday(storedState, date) &&
      hasStoredResults(storedState)
    ) {
      return storedState;
    }

    return createInitialState(date, wordLength);
  });

  const [error, setError] = useState<string | null>(null);

  const updateState = (newState: Partial<GameState>) => {
    setState((prev) => {
      const next = { ...prev, ...newState };
      storage.setItem(next);
      return next;
    });
  };

  const addLetter = (letter: string) => {
    if (state.status !== "playing") return;
    if (letter.length !== 1) return;
    if (state.currentInput.length >= state.wordLength) return;
    updateState({ currentInput: state.currentInput + letter.toUpperCase() });
  };

  const removeLetter = () => {
    if (state.status !== "playing") return;
    if (state.currentInput.length === 0) return;
    updateState({ currentInput: state.currentInput.slice(0, -1) });
  };

  const submitGuess = async () => {
    if (state.status !== "playing") return;
    if (state.currentInput.length !== state.wordLength) {
      setError("Not enough letters");
      return;
    }

    const response = await processGuess(state.currentInput, state.guesses);
    if (!response.ok) {
      setError(response.error);
      return;
    }

    setError(null);
    const now = new Date().getTime();
    updateState({
      guesses: [...state.guesses, state.currentInput],
      guessResults: [...state.guessResults, response.result],
      currentInput: "",
      startedAt: state.startedAt ?? now,
      status: response.status,
    });
  };

  useHotkey("Enter", async () => {
    await submitGuess();
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
  };
};

export default useGameState;
