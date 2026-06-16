export type ShareResultMethod = "shared" | "copied";

const isShareCancelled = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

export const shareGameResult = async (
  text: string,
): Promise<ShareResultMethod> => {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (error) {
      if (isShareCancelled(error)) {
        throw error;
      }
    }
  }

  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    throw new Error("Share unavailable");
  }

  await navigator.clipboard.writeText(text);
  return "copied";
};
