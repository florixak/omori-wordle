"use client";

import OmoriButton from "@/components/omori/omori-button";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "@/components/omori/omori-dialog";
import { AVATARS } from "@/constants";
import useProfile from "@/hooks/use-profile";
import { getAvatarSrc } from "@/lib/friend-utils";
import Image from "next/image";
import { useState } from "react";
import ConfirmDialog from "./confirm-dialog";

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const {
    updateAvatarMutation,
    isUpdatingAvatar,
    selectedAvatarId,
    deleteAccountMutation,
    isDeletingAccount,
  } = useProfile();
  const [pendingSelection, setPendingSelection] = useState<
    string | undefined
  >();
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const activeSelection = pendingSelection ?? selectedAvatarId;
  const isBusy = isUpdatingAvatar || isDeletingAccount;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setPendingSelection(undefined);
      setShowDeleteAccountDialog(false);
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

  const handleDeleteAccount = async () => {
    await deleteAccountMutation();
    setShowDeleteAccountDialog(false);
    handleOpenChange(false);
  };

  const canUpdateAvatar =
    activeSelection && activeSelection !== selectedAvatarId;

  return (
    <>
      <OmoriDialog open={open} onOpenChange={handleOpenChange}>
        <OmoriDialogContent>
          <OmoriDialogHeader>
            <OmoriDialogTitle>Profile</OmoriDialogTitle>
            <OmoriDialogDescription>
              Select an avatar to update your profile.
            </OmoriDialogDescription>
          </OmoriDialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setPendingSelection(avatar.id)}
                disabled={isBusy}
                className="relative cursor-pointer p-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Image
                  src={getAvatarSrc(avatar.image)}
                  alt={avatar.name}
                  width={100}
                  height={100}
                  className="h-auto w-full shrink-0 rounded border border-black"
                  loading="lazy"
                />
                {activeSelection === avatar.id ? (
                  <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-black" />
                ) : null}
              </button>
            ))}
          </div>
          <OmoriDialogFooter>
            <OmoriButton
              onClick={handleSubmit}
              disabled={isBusy || !canUpdateAvatar}
            >
              {isUpdatingAvatar
                ? "Updating..."
                : canUpdateAvatar
                  ? "Update Avatar"
                  : "Already selected"}
            </OmoriButton>
          </OmoriDialogFooter>
          <div className="omori-border omori-panel flex flex-col gap-2 border-destructive/40 p-4">
            <h3 className="font-pixel text-sm font-medium text-destructive">
              Danger Zone
            </h3>
            <p className="font-pixel text-xs text-muted-foreground">
              Delete your account and all associated data. This action is
              irreversible.
            </p>
            <OmoriButton
              type="button"
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:text-destructive-foreground"
              disabled={isBusy}
              onClick={() => setShowDeleteAccountDialog(true)}
            >
              Delete Account
            </OmoriButton>
          </div>
        </OmoriDialogContent>
      </OmoriDialog>
      <ConfirmDialog
        open={open && showDeleteAccountDialog}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setShowDeleteAccountDialog(false);
          }
        }}
        title="Delete Account"
        description="Delete your account and all associated data. This action is irreversible."
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteAccountDialog(false)}
        isLoading={isDeletingAccount}
      />
    </>
  );
};

export default ProfileDialog;
