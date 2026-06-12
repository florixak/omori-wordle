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
import OmoriButton from "@/components/omori/omori-button";

type AvatarsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AvatarsDialog = ({ open, onOpenChange }: AvatarsDialogProps) => {
  const { updateAvatarMutation, isUpdatingAvatar, selectedAvatarId } =
    useProfile();
  const [pendingSelection, setPendingSelection] = useState<
    string | undefined
  >();
  const activeSelection = pendingSelection ?? selectedAvatarId;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setPendingSelection(undefined);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = () => {
    if (!activeSelection || activeSelection === selectedAvatarId) {
      return;
    }

    void updateAvatarMutation(activeSelection, {
      onSuccess: () => {
        handleOpenChange(false);
      },
    });
  };

  return (
    <OmoriDialog open={open} onOpenChange={handleOpenChange}>
      <OmoriDialogContent>
        <OmoriDialogHeader>
          <OmoriDialogTitle>Avatars</OmoriDialogTitle>
          <OmoriDialogDescription>
            Select an avatar to update your profile.
          </OmoriDialogDescription>
        </OmoriDialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => setPendingSelection(avatar.id)}
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
              {activeSelection === avatar.id && (
                <span className="absolute top-2 right-2 w-4 h-4 text-foreground font-pixel rounded-full bg-black"></span>
              )}
            </button>
          ))}
        </div>
        <OmoriDialogFooter>
          <OmoriButton
            onClick={handleSubmit}
            disabled={
              isUpdatingAvatar ||
              !activeSelection ||
              activeSelection === selectedAvatarId
            }
          >
            {isUpdatingAvatar ? "Updating..." : "Update Avatar"}
          </OmoriButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default AvatarsDialog;
