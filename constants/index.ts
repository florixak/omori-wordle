const MAX_ATTEMPTS = 6;
const MIN_ATTEMPTS_FOR_HINT = 3;

const GAME_STORAGE_KEY = "omori-wordle-game";

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const GUESS_DISTRIBUTION_KEYS = ["1", "2", "3", "4", "5", "6", "0"] as const;

export {
  MAX_ATTEMPTS,
  MIN_ATTEMPTS_FOR_HINT,
  KEYBOARD_LAYOUT,
  GAME_STORAGE_KEY,
  GUESS_DISTRIBUTION_KEYS,
};
