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
  hintSnapshotCache = null;
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
    hintUsed: false,
    hint: null,
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

export type GameHintState = Pick<GameState, "hintUsed" | "hint">;

const emptyHintState: GameHintState = {
  hintUsed: false,
  hint: null,
};

let hintSnapshotCache: {
  raw: string | null;
  today: string;
  state: GameHintState;
} | null = null;

export const readStoredHintState = (): GameHintState => {
  if (typeof window === "undefined") {
    return emptyHintState;
  }

  try {
    const today = getTodayString();
    const raw = window.localStorage.getItem(GAME_STORAGE_KEY);

    if (
      hintSnapshotCache &&
      hintSnapshotCache.raw === raw &&
      hintSnapshotCache.today === today
    ) {
      return hintSnapshotCache.state;
    }

    if (!raw) {
      hintSnapshotCache = { raw: null, today, state: emptyHintState };
      return emptyHintState;
    }

    const parsed = JSON.parse(raw) as Partial<GameState>;

    if (parsed.date !== today) {
      hintSnapshotCache = { raw, today, state: emptyHintState };
      return emptyHintState;
    }

    const hintUsed = parsed.hintUsed === true;
    const hint = typeof parsed.hint === "string" ? parsed.hint : null;

    if (!hintUsed && hint === null) {
      return emptyHintState;
    }

    if (
      hintSnapshotCache &&
      hintSnapshotCache.state.hintUsed === hintUsed &&
      hintSnapshotCache.state.hint === hint
    ) {
      hintSnapshotCache = { raw, today, state: hintSnapshotCache.state };
      return hintSnapshotCache.state;
    }

    const state: GameHintState = { hintUsed, hint };
    hintSnapshotCache = { raw, today, state };
    return state;
  } catch {
    return emptyHintState;
  }
};

export const getServerHintSnapshot = (): GameHintState => emptyHintState;
