import React from "react";
import {
  OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
} from "../omori/omori-dialog";
import WordleButton from "../wordle-button";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
  isLoading: boolean;
};

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmDialogProps) => {
  return (
    <OmoriDialog open={open} onOpenChange={onOpenChange}>
      <OmoriDialogContent>
        <OmoriDialogHeader>
          <OmoriDialogTitle>{title}</OmoriDialogTitle>
        </OmoriDialogHeader>
        <OmoriDialogDescription>{description}</OmoriDialogDescription>
        <OmoriDialogFooter>
          <WordleButton
            className="w-full gap-2"
            onClick={onCancel}
            tabIndex={0}
            disabled={isLoading}
          >
            Cancel
          </WordleButton>
          <WordleButton
            className={cn("w-full gap-2", "omori-button-default")}
            onClick={onConfirm}
            tabIndex={0}
            disabled={isLoading}
          >
            Confirm
          </WordleButton>
        </OmoriDialogFooter>
      </OmoriDialogContent>
    </OmoriDialog>
  );
};

export default ConfirmDialog;
