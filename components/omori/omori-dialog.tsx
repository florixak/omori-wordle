"use client";

import { X } from "lucide-react";
import * as React from "react";

import {
  omoriBorder,
  omoriFont,
  omoriPanel,
  omoriPress,
} from "@/lib/omori-styles";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

function OmoriDialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn(
        omoriBorder,
        omoriPanel,
        omoriFont,
        "gap-4 p-5 ring-0",
        className,
      )}
      overlayClassName="bg-black/40"
      showCloseButton={false}
      {...props}
    >
      {children}
      {showCloseButton ? (
        <DialogClose
          render={
            <Button
              variant="outline"
              className={cn(
                omoriBorder,
                omoriPress,
                omoriFont,
                "absolute top-3 right-3 size-8 p-0",
              )}
              aria-label="Close"
            />
          }
        >
          <X size={16} />
        </DialogClose>
      ) : null}
    </DialogContent>
  );
}

function OmoriDialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  return <DialogHeader className={cn("gap-2 pr-8", className)} {...props} />;
}

function OmoriDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      className={cn("text-sm uppercase tracking-wide sm:text-base", className)}
      {...props}
    />
  );
}

function OmoriDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  return (
    <DialogDescription
      className={cn("text-[0.625rem] leading-relaxed sm:text-xs", className)}
      {...props}
    />
  );
}

function OmoriDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  return (
    <DialogFooter
      className={cn("flex-col sm:flex-col sm:justify-start", className)}
      {...props}
    />
  );
}

export {
  Dialog as OmoriDialog,
  OmoriDialogContent,
  OmoriDialogDescription,
  OmoriDialogFooter,
  OmoriDialogHeader,
  OmoriDialogTitle,
};
