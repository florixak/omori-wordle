"use client";

import { AVATARS } from "@/constants";
import useProfile from "@/hooks/use-profile";
import { getAvatarSrc } from "@/lib/friend-utils";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "@/components/omori/omori-dialog";
import WordleButton from "@/components/wordle-button";

type AvatarsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AvatarsDialog = ({ open, onOpenChange }: AvatarsDialogProps) => {
  const { updateAvatarMutation, isUpdatingAvatar, selectedAvatarId } =
    useProfile();
  const [selected, setSelected] = useState<string | undefined>(
    selectedAvatarId,
  );

  const handleUpdateAvatar = (avatarId: string) => {
    setSelected(avatarId);
  };

  const handleSubmit = () => {
    if (selected) {
      void updateAvatarMutation(selected);
    }
  };

  return (
    <OmoriDialog open={open} onOpenChange={onOpenChange}>
      <OmoriDialogContent>
        <OmoriDialogHeader>
          <OmoriDialogTitle>Avatars</OmoriDialogTitle>
        </OmoriDialogHeader>
        <OmoriDialogDescription>
          Select an avatar to update your profile.
        </OmoriDialogDescription>
        <div className="grid grid-cols-2 gap-4">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleUpdateAvatar(avatar.id)}
              className="p-0 cursor-pointer relative"
            >
              <Image
                src={getAvatarSrc(avatar.image)}
                alt={avatar.name}
                width={100}
                height={100}
                className={cn(
                  "w-full h-auto shrink-0 rounded border border-black",
                )}
                loading="lazy"
              />
              {selected === avatar.id && (
                <span className="absolute top-2 right-2 w-4 h-4 text-foreground font-pixel rounded-full bg-black"></span>
              )}
            </button>
          ))}
        </div>
        <OmoriDialogFooter>
          <WordleButton
            onClick={handleSubmit}
            disabled={isUpdatingAvatar || !selected}
          >
            {isUpdatingAvatar ? "Updating..." : "Update Avatar"}
          </WordleButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default AvatarsDialog;
