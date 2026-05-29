"use client";

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
        "rounded font-pixel border-2 border-black h-10",
        "text-[0.625rem] leading-none sm:text-base",
        "shadow-[2px_2px_0px_var(--omori-shadow)]",
        "transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        "disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-[var(--omori-absent)] disabled:text-white",
        className,
      )}
    >
      {children}
    </Button>
  );
};

export default WordleButton;
