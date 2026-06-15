import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-dvh overflow-x-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className={cn(
            "omori-border omori-press font-pixel",
            "mb-8 inline-flex h-10 items-center gap-2 rounded px-3",
            "bg-background text-foreground",
            "text-[0.825rem] leading-none sm:text-base",
            "hover:bg-muted hover:text-foreground",
          )}
          aria-label="Back to the daily puzzle"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Back to game
        </Link>
        {children}
      </div>
    </main>
  );
}
