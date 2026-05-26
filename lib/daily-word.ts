import "server-only";
import { WORDS } from "@/data/answer-pool";
import { getTodayString } from "./local-game-state";

const EPOCH = new Date("2025-01-01").getTime();

const getDayIndex = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - EPOCH) / (1000 * 60 * 60 * 24));
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
  return getTodayString();
};

export const isValidGuess = (guess: string): boolean => {
  const wordLength = getDailyWordLength();
  const upper = guess.toUpperCase();
  return upper.length === wordLength && WORDS.some((word) => word === upper);
};
