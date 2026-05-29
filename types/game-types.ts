export type GameStatus = "playing" | "won" | "lost";

export type TileEvaluation = "correct" | "present" | "absent";

export type TileDisplayState = "empty" | "active" | TileEvaluation;

export type SubmittedGuess = {
  word: string;
  evaluations: TileEvaluation[];
};

export type GridTile = {
  letter: string;
  display: TileDisplayState;
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
