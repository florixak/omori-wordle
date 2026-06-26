"use client";

import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "@/components/omori/omori-dialog";
import OmoriButton from "@/components/omori/omori-button";
import { cn } from "@/lib/utils";

type KeepsakeDialogProps = {
  open: boolean;
  onUseKeepsake: () => void | Promise<void>;
  onDecline: () => void | Promise<void>;
  isLoading: boolean;
};

const KeepsakeDialog = ({
  open,
  onUseKeepsake,
  onDecline,
  isLoading,
}: KeepsakeDialogProps) => {
  return (
    <OmoriDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          return;
        }
      }}
    >
      <OmoriDialogContent showCloseButton={false}>
        <OmoriDialogHeader>
          <OmoriDialogTitle>Keepsake</OmoriDialogTitle>
        </OmoriDialogHeader>
        <OmoriDialogDescription>
          A Keepsake can keep this day from fading away. Your streak stays safe
          — but the day you missed won&apos;t count toward it.
        </OmoriDialogDescription>
        <OmoriDialogFooter>
          <OmoriButton
            className="w-full gap-2"
            onClick={onDecline}
            disabled={isLoading}
          >
            Let it go
          </OmoriButton>
          <OmoriButton
            className={cn("w-full gap-2", "omori-button-default")}
            onClick={onUseKeepsake}
            disabled={isLoading}
          >
            Use Keepsake
          </OmoriButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default KeepsakeDialog;
