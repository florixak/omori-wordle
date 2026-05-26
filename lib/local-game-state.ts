import { GameState } from "@/types/game-types";

export const GAME_STORAGE_KEY = "omori-wordle-game";

export const createInitialState: (
  date: string,
  wordLength: number,
) => GameState = (date, wordLength) => {
  return {
    date,
    wordLength,
    guesses: [],
    guessResults: [],
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
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
