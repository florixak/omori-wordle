import Link from "next/link";
import { connection } from "next/server";

const Footer = async () => {
  await connection();
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="flex flex-col items-center justify-center gap-2 p-4 bg-(--omori-empty)">
      <p className="font-pixel text-xs">
        © {year} Omori Wordle · Fan-made project · Not affiliated with OMOCAT
        LLC
      </p>
      <p className="font-pixel text-xs">
        Created with ❤️ for OMORI community by{" "}
        <Link
          href="https://github.com/florixak"
          target="_blank"
          className="underline"
          rel="noopener noreferrer"
        >
          Ondrej Ptak
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
