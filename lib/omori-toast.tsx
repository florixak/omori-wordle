"use client";

import {
  OmoriToast,
  type OmoriToastVariant,
} from "@/components/omori/omori-toast";
import toast from "react-hot-toast";

const DEFAULT_DURATION = 3000;

function showOmoriToast(message: string, variant: OmoriToastVariant) {
  return toast.custom(
    (t) => <OmoriToast toast={t} message={message} variant={variant} />,
    { duration: DEFAULT_DURATION },
  );
}

export const omoriToast = {
  success: (message: string) => showOmoriToast(message, "success"),
  error: (message: string) => showOmoriToast(message, "error"),
  info: (message: string) => showOmoriToast(message, "info"),
  loading: (message: string) => showOmoriToast(message, "loading"),
};
