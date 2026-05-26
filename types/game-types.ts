export type GameStatus = "playing" | "won" | "lost";

export type SubmittedGuess = {
  word: string; // for easy lookup in history
  result: GuessResult;
};

export type GameState = {
  date: string;
  wordLength: number;
  submittedGuesses: SubmittedGuess[];
  currentInput: string;
  status: GameStatus;
  startedAt: number | null;
  historySignature?: string;
};

export type TileState = "correct" | "present" | "absent";

export type GuessResult = {
  letter: string;
  state: TileState;
}[];
