import ProfileHeader from "@/components/profile-header";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ProfileHeader />
      <main className="flex min-h-dvh flex-col items-center justify-center overflow-x-hidden px-4 py-6 sm:px-6">
        {children}
      </main>
    </>
  );
}
