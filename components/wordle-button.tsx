"use client";

import {
  omoriBorder,
  omoriButtonDisabled,
  omoriFont,
  omoriPress,
} from "@/lib/omori-styles";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";

type WordleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const WordleButton = ({ children, className, ...props }: WordleButtonProps) => {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(
        omoriBorder,
        omoriPress,
        omoriFont,
        omoriButtonDisabled,
        "rounded h-10 text-[0.625rem] leading-none sm:text-base",
        className,
      )}
    >
      {children}
    </Button>
  );
};

export default WordleButton;
