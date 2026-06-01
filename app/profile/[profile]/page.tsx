import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

type ProfilePageProps = {
  params: Promise<{ profile: string }>;
};

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
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
