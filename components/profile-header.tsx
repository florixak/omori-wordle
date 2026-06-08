"use client";

import HeaderProfileActions from "@/components/header-profile-actions";
import WordleButton from "@/components/wordle-button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfileHeader = () => {
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 gap-2 md:gap-4">
      <div className="flex items-center gap-2 flex-wrap justify-start">
        <WordleButton
          className="py-0"
          aria-label="Back to game"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={24} />
        </WordleButton>
      </div>
      <div className="flex-1" />
      <HeaderProfileActions />
    </header>
  );
};

export default ProfileHeader;
