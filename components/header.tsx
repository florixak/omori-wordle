import Link from "next/link";
import React from "react";
import WordleTile from "./wordle-tile";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">OMORI Wordle</h1>
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <WordleTile letter="O" display="active" />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
