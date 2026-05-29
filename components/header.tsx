"use client";

import { BarChart, Link, LogOut, User } from "lucide-react";
import WordleButton from "./wordle-button";
import { authClient } from "@/lib/auth-client";

const Header = () => {
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "discord",
    });
  };

  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 gap-2 md:gap-4">
      <WordleButton className="py-0">
        <BarChart size={24} />
      </WordleButton>
      <div className="flex items-center gap-2">
        {session ? <span>{session.user.name}</span> : null}
        {session ? (
          <WordleButton className="py-0" onClick={handleLogout}>
            <LogOut size={24} />
          </WordleButton>
        ) : null}
        <WordleButton className="py-0" onClick={handleLogin}>
          <User size={24} />
        </WordleButton>
      </div>
    </header>
  );
};

export default Header;
