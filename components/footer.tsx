import Link from "next/link";
import { connection } from "next/server";

const Footer = async () => {
  await connection();
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="flex flex-col items-center justify-center gap-2 p-4 bg-(--omori-empty)">
      <p className="font-pixel text-xs text-center">
        © {year} Omori Wordle · Fan-made project · Not affiliated with OMOCAT
        LLC ·{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
      </p>
      <p className="font-pixel text-xs text-center">
        Created with 💜 for OMORI community
      </p>
    </footer>
  );
};

export default Footer;
