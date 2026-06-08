import { auth } from "@/auth";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata({}): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/");
  }

  return createPageMetadata({
    title: "Profile",
    description: "View your profile and game history.",
    path: "/profile",
    noIndex: true,
  });
}

const ProfilePage = () => {
  return <div>ProfilePage</div>;
};

export default ProfilePage;
