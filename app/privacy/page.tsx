import PrivacyPolicyContent from "@/components/privacy-policy-content";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "How OMORI Wordle collects, uses, stores, and protects your personal data under GDPR.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
