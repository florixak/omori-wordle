import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profile: string }>;
}): Promise<Metadata> {
  const { profile } = await params;
  const username = decodeURIComponent(profile);

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
