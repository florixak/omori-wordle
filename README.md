# OMORI Wordle

> **Non-commercial fan project** — not affiliated with or endorsed by OMOCAT or the official *OMORI* game.

A daily word-guessing game for fans of *OMORI*. Same rules as Wordle, same universe — characters, locations, items, emotions, and lore terms only. One puzzle per day, shared by everyone. No account required to play.

---

## How to play

Type a valid OMORI word and press **Enter**. The grid adjusts to the day's word length (4–7 letters).

| Tile | Meaning |
|------|---------|
| ⬜ | Correct letter, correct position |
| 🟨 | Correct letter, wrong position |
| ⬛ | Letter not in the word |

You have **6 attempts**. A new word drops every day at midnight.

Stuck? You get **one hint per day** — a lore-based clue about the answer. Use it wisely.

---

## Features

- **Daily puzzle** — one word, same for all players, every day
- **Variable word length** — the grid adapts to each day's answer (4–7 letters)
- **Play as a guest** — full game, no sign-in required, progress saved locally
- **Discord sign-in** — save results to the cloud, track streaks, view stats, and compete on a friends-only leaderboard
- **Hint system** — one lore clue per puzzle
- **Share your result** — spoiler-free emoji grid to send to friends

---

## What I built

This started as a fan project and grew into a portfolio piece — a full-stack app with real auth, persistence, and social features, not just a static clone.

- **Server-side word protection** — the daily answer never reaches the client; guesses are validated server-side and the word is revealed only after win or loss
- **Deterministic daily selection** — the puzzle is picked from a curated pool by days since a fixed epoch, so every player gets the same word without a database call
- **Hybrid state management** — in-progress games live in `localStorage` for guests; completed results sync to Postgres, with retroactive submission if you sign in after playing
- **Discord OAuth via BetterAuth** — optional auth that unlocks stats and social features without gating the core game loop
- **Bidirectional friendships** — accepted friendships are stored as mirrored rows, keeping queries simple and deletes atomic

---

## Tech stack

Next.js 16 · TypeScript · Tailwind CSS · BetterAuth (Discord OAuth) · Neon Postgres · Drizzle ORM · Vercel

---

## Disclaimer

*OMORI* and all related characters, names, and imagery are the property of OMOCAT. This project is an unofficial fan work made out of appreciation for the game. It is free, non-commercial, and not connected to OMOCAT in any way.

If you are OMOCAT or a rights holder and have concerns, please reach out.