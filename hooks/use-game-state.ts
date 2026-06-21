"use client";

import {
  getCompletedGameReveal,
  getHint,
  getTodayCompletedGame,
  processGuess,
  submitGame,
} from "@/actions/game-actions";
import {
  GAME_STORAGE_KEY,
  MAX_ATTEMPTS,
  MIN_ATTEMPTS_FOR_HINT,
} from "@/constants";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { authClient } from "@/lib/auth-client";
import { ErrorCode, getErrorMessage } from "@/lib/errors";
import { omoriToast } from "@/lib/omori-toast";
import { getKeyboardStateFromGuesses } from "@/lib/game-logic";
import {
  getGuessWords,
  shouldRestoreGameFromServer,
} from "@/lib/game-state-utils";
import { buildGridRows } from "@/lib/grid-view";
import {
  getServerGameSnapshot,
  notifyGameStorageChange,
  readStoredGameState,
  subscribeToGameStorage,
} from "@/lib/local-game-state";
import { GameState, GridTile, TileEvaluation } from "@/types/game-types";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { invalidateUserStats } from "./query-options";
import { useQueryClient } from "@tanstack/react-query";

type UseGameProps = {
  date: string;
  wordLength: number;
  savedGame?: GameState | null;
};

type UseGameStateReturn = {
  state: GameState;
  gridRows: GridTile[][];
  keyboardState: Record<string, TileEvaluation>;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => Promise<void>;
  requestHint: () => Promise<string | null>;
  isSubmitting: boolean;
};

const useGameState = ({
  date,
  wordLength,
  savedGame,
}: UseGameProps): UseGameStateReturn => {
  const { data: session } = authClient.useSession();
  const storage = useLocalStorage<GameState>(GAME_STORAGE_KEY);
  const queryClient = useQueryClient();
  const hasHydratedFromServerRef = useRef(false);

  const state = useSyncExternalStore(
    subscribeToGameStorage,
    () => readStoredGameState(date, wordLength),
    () => getServerGameSnapshot(date, wordLength),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const stateRef = useRef(state);
  const isSubmittingRef = useRef(false);

  // This effect is used to update the state ref when the state changes.
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const updateGameState = (updater: (prev: GameState) => GameState) => {
    const next = updater(readStoredGameState(date, wordLength));
    storage.setItem(next);
    notifyGameStorageChange();
  };

  const restoreSavedGame = (gameState: GameState) => {
    if (hasHydratedFromServerRef.current) {
      return;
    }

    const local = readStoredGameState(date, wordLength);
    if (!shouldRestoreGameFromServer(local, date, wordLength)) {
      return;
    }

    hasHydratedFromServerRef.current = true;
    storage.setItem(gameState);
    notifyGameStorageChange();
  };

  // Seed localStorage from the server when a logged-in user already played today
  useEffect(() => {
    if (!savedGame) {
      return;
    }

    restoreSavedGame(savedGame);
  }, [savedGame, date, wordLength]);

  // Handle sign-in after page load (guest played elsewhere or fresh session)
  useEffect(() => {
    if (!session || savedGame !== undefined) {
      return;
    }

    void getTodayCompletedGame().then((result) => {
      if (!result?.ok) {
        return;
      }

      restoreSavedGame(result.gameState);
    });
  }, [session, savedGame, date, wordLength]);

  // Reveal the word and hint for a completed game
  useEffect(() => {
    if (state.status !== "won" && state.status !== "lost") {
      return;
    }

    if (state.revealedWord && state.answerHint) {
      return;
    }

    const guesses = getGuessWords(state.submittedGuesses);

    void getCompletedGameReveal({
      date: state.date,
      guesses,
      historySignature: state.historySignature,
    })
      .then((result) => {
        if (!result.ok) {
          return;
        }

        updateGameState((prev) => ({
          ...prev,
          revealedWord: result.revealedWord,
          answerHint: result.answerHint,
        }));
      })
      .catch(() => {
        // Reveal data is non-critical; ignore transient fetch failures.
      });
  }, [
    state.status,
    state.revealedWord,
    state.answerHint,
    state.date,
    state.submittedGuesses,
    state.historySignature,
  ]);

  const addLetter = (letter: string) => {
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
      omoriToast.error(getErrorMessage(ErrorCode.NOT_ENOUGH_LETTERS));
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

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
        if (response.error === ErrorCode.ALREADY_PLAYED_TODAY) {
          const saved = await getTodayCompletedGame();
          if (saved?.ok) {
            hasHydratedFromServerRef.current = true;
            storage.setItem(saved.gameState);
            notifyGameStorageChange();
            return;
          }

          omoriToast.error(getErrorMessage(response.error));
          return;
        }

        if (response.error === ErrorCode.PROGRESS_OUT_OF_SYNC) {
          storage.removeItem();
          notifyGameStorageChange();
          omoriToast.error(getErrorMessage(response.error));
          return;
        }

        if (response.error === ErrorCode.INVALID_GAME_STATE) {
          storage.removeItem();
          notifyGameStorageChange();
          omoriToast.error(
            getErrorMessage(ErrorCode.INVALID_GAME_STATE_CLEARED),
          );
          return;
        }

        omoriToast.error(getErrorMessage(response.error));
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
        ...(response.status === "won" || response.status === "lost"
          ? {
              revealedWord: response.revealedWord ?? null,
              answerHint: response.answerHint ?? null,
            }
          : {}),
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
          omoriToast.error(getErrorMessage(saveResult.error));
        }

        invalidateUserStats(queryClient, session.user.id);
      }
    } catch {
      omoriToast.error(getErrorMessage(ErrorCode.SUBMIT_GUESS_FAILED));
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const requestHint = async (): Promise<string | null> => {
    const snapshot = stateRef.current;

    if (snapshot.hintUsed && snapshot.hint) {
      return snapshot.hint;
    }

    const guesses = getGuessWords(snapshot.submittedGuesses);

    if (guesses.length < MIN_ATTEMPTS_FOR_HINT) {
      omoriToast.info(getErrorMessage(ErrorCode.HINT_MIN_GUESSES_REQUIRED));
      return null;
    }

    try {
      const response = await getHint({
        date: snapshot.date,
        guesses,
        historySignature: snapshot.historySignature,
      });

      if (!response.ok) {
        omoriToast.error(getErrorMessage(response.error));
        return null;
      }

      updateGameState((prev) => ({
        ...prev,
        hintUsed: true,
        hint: response.hint,
      }));

      if (session) {
        invalidateUserStats(queryClient, session.user.id);
      }

      return response.hint;
    } catch {
      omoriToast.error(getErrorMessage(ErrorCode.LOAD_HINT_FAILED));
      return null;
    }
  };

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
    isSubmitting,
  };
};

export default useGameState;
