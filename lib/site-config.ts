const getSiteUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export const siteConfig = {
  name: "Omori Wordle",
  title: "Omori Wordle — Daily HEADSPACE Word Puzzle",
  description:
    "A fan-made daily word game inspired by OMORI and Wordle. Guess Omori-themed words from HEADSPACE — characters, locations, items, and lore. One puzzle per day, 4–7 letters.",
  tagline: "Guess the word. Explore HEADSPACE.",
  url: getSiteUrl(),
  locale: "en_US",
  creator: {
    name: "Ondřej Pták",
    url: "https://github.com/florixak",
  },
  keywords: [
    "Omori Wordle",
    "OMORI",
    "Wordle",
    "daily word game",
    "HEADSPACE",
    "fan game",
    "word puzzle",
    "Omori fan project",
  ],
  disclaimer:
    "Fan-made project. Not affiliated with or endorsed by OMOCAT LLC.",
} as const;

export const getCanonicalUrl = (path = ""): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath === "/"
    ? siteConfig.url
    : `${siteConfig.url}${normalizedPath}`;
};
