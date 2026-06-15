"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const omoriBadgeVariants = cva(
  "omori-border font-pixel rounded-none h-auto shrink-0 px-2 py-0.5 text-[0.625rem] uppercase leading-none tracking-wide sm:text-xs",
  {
    variants: {
      variant: {
        hint: "bg-[var(--omori-present)] text-[var(--omori-border)]",
        present: "bg-[var(--omori-present)] text-black",
        muted: "bg-[var(--omori-empty)] text-muted-foreground",
        absent: "bg-[var(--omori-absent)] text-white",
        outline: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "hint",
    },
  },
);

type OmoriBadgeProps = Omit<ComponentProps<typeof Badge>, "variant"> &
  VariantProps<typeof omoriBadgeVariants>;

const OmoriBadge = ({
  children,
  className,
  variant = "hint",
  ...props
}: OmoriBadgeProps) => {
  return (
    <Badge
      variant="outline"
      className={cn(omoriBadgeVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Badge>
  );
};

export default OmoriBadge;
