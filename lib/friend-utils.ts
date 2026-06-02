import { DEFAULT_AVATAR } from "@/constants";

export const formatAttempts = (
  attempts: number | null,
  won: boolean,
): string => {
  if (attempts === null) {
    return "—";
  }

  if (!won) {
    return "X";
  }

  return String(attempts);
};

export const getAvatarSrc = (image: string | null): string =>
  image && image.trim().length > 0 ? image : DEFAULT_AVATAR;
