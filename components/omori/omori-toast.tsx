"use client";

import { cn } from "@/lib/utils";
import type { Toast as HotToast } from "react-hot-toast";

export type OmoriToastVariant = "success" | "error" | "info";

const variantStyles: Record<OmoriToastVariant, string> = {
  success: "bg-[var(--omori-present)] text-[var(--omori-border)]",
  error: "bg-destructive text-destructive-foreground",
  info: "bg-[var(--omori-empty)] text-foreground",
};

interface OmoriToastProps {
  toast: HotToast;
  message: string;
  variant?: OmoriToastVariant;
}

export function OmoriToast({
  toast,
  message,
  variant = "info",
}: OmoriToastProps) {
  return (
    <div
      className={cn(
        "omori-border font-pixel pointer-events-auto",
        "max-w-xs px-3 py-2",
        "text-[0.625rem] uppercase tracking-wide sm:text-xs",
        variantStyles[variant],
        toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      )}
      style={{ transition: "all 200ms ease-in-out" }}
    >
      {message}
    </div>
  );
}
