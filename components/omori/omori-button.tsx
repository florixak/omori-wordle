"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";

type OmoriButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

const OmoriButton = ({ children, className, ...props }: OmoriButtonProps) => {
  return (
    <Button
      {...props}
      variant="outline"
      className={cn(
        "omori-border omori-press font-pixel omori-button-disabled",
        "rounded h-10 bg-background text-foreground",
        "text-[0.825rem] leading-none sm:text-base",
        "hover:bg-muted hover:text-foreground cursor-pointer",
        className,
      )}
    >
      {children}
    </Button>
  );
};

export default OmoriButton;
