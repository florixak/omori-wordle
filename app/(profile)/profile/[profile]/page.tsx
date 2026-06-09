import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profile: string }>;
}): Promise<Metadata> {
  const { profile } = await params;
  let username = profile;
  try {
    username = decodeURIComponent(profile);
  } catch {
    redirect("/");
  }

  return createPageMetadata({
    title: `${username}'s Profile`,
    description: `View ${username}'s Omori Wordle stats and game history.`,
    path: `/profile/${profile}`,
    noIndex: true,
  });
}

const ProfilePage = () => {
  return <div>ProfilePage</div>;
};

export default ProfilePage;
