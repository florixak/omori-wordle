import { siteConfig } from "@/lib/site-config";
import { ImageResponse } from "next/og";

export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f4f0",
        color: "#2a2a2a",
        padding: "64px",
        border: "12px solid #2a2a2a",
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "0.04em",
          marginBottom: 24,
          textTransform: "uppercase",
        }}
      >
        {siteConfig.name}
      </div>
      <div
        style={{
          fontSize: 32,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.4,
        }}
      >
        {siteConfig.tagline}
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 22,
          opacity: 0.75,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        Daily Omori-themed words · One puzzle per day · 4–7 letters
      </div>
    </div>,
    {
      ...size,
    },
  );
}
