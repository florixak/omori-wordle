import Header from "@/components/header";

export default function GameLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex min-h-dvh flex-col items-center justify-center overflow-x-hidden px-4 py-6 sm:px-6">
        {children}
      </main>
    </>
  );
}
