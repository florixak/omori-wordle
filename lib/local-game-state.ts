import { GAME_STORAGE_KEY } from "@/constants";
import { loadStoredGameState } from "@/lib/game-state-utils";
import { GameState } from "@/types/game-types";

const gameStorageListeners = new Set<() => void>();
let isStorageReadable = false;

const initialStateCache = new Map<string, GameState>();
let storedSnapshotCache: { raw: string | null; state: GameState } | null = null;

const getInitialStateCacheKey = (date: string, wordLength: number): string =>
  `${date}:${wordLength}`;

const readStoredSnapshot = (date: string, wordLength: number): GameState => {
  try {
    const raw = window.localStorage.getItem(GAME_STORAGE_KEY);

    if (
      storedSnapshotCache &&
      storedSnapshotCache.raw === raw &&
      storedSnapshotCache.state.date === date &&
      storedSnapshotCache.state.wordLength === wordLength
    ) {
      return storedSnapshotCache.state;
    }

    if (!raw) {
      const initialState = getCachedInitialState(date, wordLength);
      storedSnapshotCache = { raw: null, state: initialState };
      return initialState;
    }

    const parsed =
      loadStoredGameState(JSON.parse(raw), date, wordLength) ??
      getCachedInitialState(date, wordLength);

    storedSnapshotCache = { raw, state: parsed };
    return parsed;
  } catch {
    return getCachedInitialState(date, wordLength);
  }
};

const getCachedInitialState = (date: string, wordLength: number): GameState => {
  const key = getInitialStateCacheKey(date, wordLength);
  const cached = initialStateCache.get(key);

  if (cached) {
    return cached;
  }

  const initialState = createInitialState(date, wordLength);
  initialStateCache.set(key, initialState);
  return initialState;
};

export const subscribeToGameStorage = (listener: () => void): (() => void) => {
  gameStorageListeners.add(listener);

  if (typeof window !== "undefined" && !isStorageReadable) {
    queueMicrotask(() => {
      isStorageReadable = true;
      notifyGameStorageChange();
    });
  }

  const onStorageEvent = (event: StorageEvent) => {
    if (event.key === GAME_STORAGE_KEY || event.key === null) {
      listener();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorageEvent);
  }

  return () => {
    gameStorageListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorageEvent);
    }
  };
};

export const notifyGameStorageChange = (): void => {
  storedSnapshotCache = null;
  gameStorageListeners.forEach((listener) => listener());
};

export const getServerGameSnapshot = (
  date: string,
  wordLength: number,
): GameState => getCachedInitialState(date, wordLength);

export const readStoredGameState = (
  date: string,
  wordLength: number,
): GameState => {
  if (typeof window === "undefined" || !isStorageReadable) {
    return getCachedInitialState(date, wordLength);
  }

  return readStoredSnapshot(date, wordLength);
};

export const createInitialState: (
  date: string,
  wordLength: number,
) => GameState = (date, wordLength) => {
  return {
    date,
    wordLength,
    submittedGuesses: [],
    currentInput: "",
    status: "playing",
    startedAt: null,
  };
};

export const isStateForToday: (state: GameState, today: string) => boolean = (
  state,
  today,
) => {
  return state.date === today;
};

export const getTodayString: () => string = () => {
  return new Date().toISOString().slice(0, 10);
};
