export type GameStatus = "playing" | "won" | "lost";

export type GameState = {
  date: string;
  wordLength: number;
  guesses: string[];
  currentInput: string;
  status: "playing" | "won" | "lost";
  startedAt: number;
};

export type TileState = "correct" | "present" | "absent";

export type GuessResult = {
  letter: string;
  state: TileState;
}[];
