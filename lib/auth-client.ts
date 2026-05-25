import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const { signIn, signUp, useSession } = createAuthClient({
  baseURL: baseURL,
});
