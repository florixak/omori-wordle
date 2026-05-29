"use client";

import { cn } from "@/lib/utils";
import React from "react";

type WordleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const WordleButton = ({ children, className, ...props }: WordleButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "rounded border-2 border-black px-1 py-2.5 sm:px-1.5 sm:py-3",
        "text-[0.625rem] leading-none sm:text-xs md:text-sm",
        "shadow-[2px_2px_0px_var(--omori-shadow)]",
        "transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        className,
      )}
      style={{ fontFamily: "var(--font-pixel)" }}
    >
      {children}
    </button>
  );
};

export default WordleButton;
