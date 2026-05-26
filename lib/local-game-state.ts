import { GameState } from "@/types/game-types";

export const GAME_STORAGE_KEY = "omori-wordle-game";

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
