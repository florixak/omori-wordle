const MAX_ATTEMPTS = 6;
const MIN_ATTEMPTS_FOR_HINT = 3;
const RESULT_DIALOG_DELAY_MS = 500;

const GAME_STORAGE_KEY = "omori-wordle-game";

const KEYBOARD_LAYOUT = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const GUESS_DISTRIBUTION_KEYS = ["1", "2", "3", "4", "5", "6", "0"] as const;

const DEFAULT_AVATAR = "/avatars/sunny.png";

const QUERY_KEYS = {
  FRIENDS_OVERVIEW: ["friends", "overview"],
  FRIENDS_LEADERBOARD: ["friends", "leaderboard"],
  STATS_KEY: ["stats"],
  STATS: (userId: string) => [...QUERY_KEYS.STATS_KEY, userId],
  FRIENDS_IS_FRIEND_KEY: ["friends", "isFriend"],
  FRIENDS_IS_FRIEND: (userId: string) => [
    ...QUERY_KEYS.FRIENDS_IS_FRIEND_KEY,
    userId,
  ],
} as const;

type Avatar = {
  id: string;
  name: string;
  image: string;
};

const AVATARS: Avatar[] = [
  {
    id: "1",
    name: "Sunny",
    image: "/avatars/sunny.png",
  },
  {
    id: "2",
    name: "Aubrey",
    image: "/avatars/aubrey.png",
  },
  {
    id: "3",
    name: "Kel",
    image: "/avatars/kel.png",
  },
  {
    id: "4",
    name: "Basil",
    image: "/avatars/basil.png",
  },
] as const;

export {
  MAX_ATTEMPTS,
  MIN_ATTEMPTS_FOR_HINT,
  RESULT_DIALOG_DELAY_MS,
  KEYBOARD_LAYOUT,
  GAME_STORAGE_KEY,
  GUESS_DISTRIBUTION_KEYS,
  DEFAULT_AVATAR,
  QUERY_KEYS,
  AVATARS,
  type Avatar,
};
