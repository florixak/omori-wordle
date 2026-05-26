export type GameState = {
  date: string;
  wordLength: number;
  guesses: string[];
  currentInput: string;
  status: "playing" | "won" | "lost";
  startedAt: number;
};
