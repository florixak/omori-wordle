import "server-only";
import { WORDS } from "@/data/answer-pool";

const EPOCH_UTC_MS = Date.UTC(2025, 0, 1);
const DAY_MS = 24 * 60 * 60 * 1000;

const getDayIndex = (): number => {
  const index = Math.floor((Date.now() - EPOCH_UTC_MS) / DAY_MS);
  return Math.max(0, index);
};

export const getDailyWord = (): string => {
  return WORDS[getDayIndex() % WORDS.length];
};

export const getDailyWordLength = (): number => {
  return getDailyWord().length;
};

export const getDayNumber = (): number => {
  return getDayIndex() + 1;
};

export const getDailyDate = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const isValidGuess = (guess: string): boolean => {
  const wordLength = getDailyWordLength();
  const upper = guess.toUpperCase();
  return upper.length === wordLength && WORDS.some((word) => word === upper);
};
