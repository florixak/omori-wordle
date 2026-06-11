import { MIN_ATTEMPTS_FOR_HINT } from "@/constants";

export const ErrorCode = {
  NOT_ENOUGH_LETTERS: "NOT_ENOUGH_LETTERS",
  NOT_IN_WORD_LIST: "NOT_IN_WORD_LIST",
  GAME_ALREADY_COMPLETED: "GAME_ALREADY_COMPLETED",
  NO_ATTEMPTS_REMAINING: "NO_ATTEMPTS_REMAINING",
  INVALID_GAME_STATE: "INVALID_GAME_STATE",
  INVALID_GAME_STATE_CLEARED: "INVALID_GAME_STATE_CLEARED",
  PROGRESS_OUT_OF_SYNC: "PROGRESS_OUT_OF_SYNC",
  ALREADY_PLAYED_TODAY: "ALREADY_PLAYED_TODAY",
  HINT_MIN_GUESSES_REQUIRED: "HINT_MIN_GUESSES_REQUIRED",
  GAME_NOT_FINISHED: "GAME_NOT_FINISHED",
  UNAUTHORIZED: "UNAUTHORIZED",
  SUBMIT_GUESS_FAILED: "SUBMIT_GUESS_FAILED",
  LOAD_HINT_FAILED: "LOAD_HINT_FAILED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  LOGOUT_FAILED: "LOGOUT_FAILED",
  USERNAME_REQUIRED: "USERNAME_REQUIRED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_NOT_FOUND_BY_USERNAME: "USER_NOT_FOUND_BY_USERNAME",
  ALREADY_FRIENDS: "ALREADY_FRIENDS",
  REQUEST_ALREADY_SENT: "REQUEST_ALREADY_SENT",
  INCOMING_REQUEST_EXISTS: "INCOMING_REQUEST_EXISTS",
  REQUEST_NOT_FOUND: "REQUEST_NOT_FOUND",
  REQUEST_NOT_PENDING: "REQUEST_NOT_PENDING",
  CANNOT_RESPOND_TO_REQUEST: "CANNOT_RESPOND_TO_REQUEST",
  NOT_REQUESTER: "NOT_REQUESTER",
  FRIEND_NOT_FOUND: "FRIEND_NOT_FOUND",
  USER_IS_NOT_FRIEND: "USER_IS_NOT_FRIEND",
  AVATAR_NOT_FOUND: "AVATAR_NOT_FOUND",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export type ErrorParams = {
  username?: string;
};

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  NOT_ENOUGH_LETTERS: "Not enough letters",
  NOT_IN_WORD_LIST: "Not in word list",
  GAME_ALREADY_COMPLETED: "Game already finished",
  NO_ATTEMPTS_REMAINING: "No attempts remaining",
  INVALID_GAME_STATE: "Invalid game state",
  INVALID_GAME_STATE_CLEARED: "Invalid game state — local progress cleared.",
  PROGRESS_OUT_OF_SYNC: "Progress out of sync — local progress cleared.",
  ALREADY_PLAYED_TODAY: "Already played today",
  HINT_MIN_GUESSES_REQUIRED: `Make at least ${MIN_ATTEMPTS_FOR_HINT} guesses before using a hint.`,
  GAME_NOT_FINISHED: "Game not finished",
  UNAUTHORIZED: "Unauthorized",
  SUBMIT_GUESS_FAILED: "Unable to submit guess right now. Please try again.",
  LOAD_HINT_FAILED: "Unable to load hint right now. Please try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again.",
  LOGOUT_FAILED: "Failed to log out",
  USERNAME_REQUIRED: "Enter a username.",
  USER_NOT_FOUND: "User not found",
  USER_NOT_FOUND_BY_USERNAME: "No user found with that username.",
  ALREADY_FRIENDS: "You are already friends.",
  REQUEST_ALREADY_SENT: "You already sent a request to this user.",
  INCOMING_REQUEST_EXISTS:
    "This user already sent you a request. Accept it instead.",
  REQUEST_NOT_FOUND: "Request not found.",
  REQUEST_NOT_PENDING: "Request is not pending.",
  CANNOT_RESPOND_TO_REQUEST: "You cannot respond to this request.",
  NOT_REQUESTER: "You are not the requester.",
  FRIEND_NOT_FOUND: "Friend not found.",
  USER_IS_NOT_FRIEND: "User is not a friend",
  AVATAR_NOT_FOUND: "Avatar not found",
};

export type ErrorResult = { ok: false; error: ErrorCode; params?: ErrorParams };

export const isErrorCode = (value: string): value is ErrorCode =>
  value in ERROR_MESSAGES;

export const getErrorMessage = (
  code: ErrorCode,
  params?: ErrorParams,
): string => {
  if (code === ErrorCode.USER_NOT_FOUND_BY_USERNAME && params?.username) {
    return `No user found with username "${params.username}".`;
  }

  return ERROR_MESSAGES[code];
};

export class AppError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, params?: ErrorParams) {
    super(getErrorMessage(code, params));
    this.name = "AppError";
    this.code = code;
  }
}

export const resolveErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error && isErrorCode(error.message)) {
    return getErrorMessage(error.message);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR];
};
