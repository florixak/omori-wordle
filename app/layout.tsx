import Footer from "@/components/footer";
import Header from "@/components/header";
import Providers from "@/components/providers/providers";
import { rootMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Silkscreen } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const pixelFont = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pixel",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#2a2a2a",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", pixelFont.variable)}>
      <body>
        <Providers>
          <Header />
          {children}
          <Suspense fallback={<div>Loading...</div>}>
            <Footer />
          </Suspense>
          <Toaster
            position="bottom-right"
            containerStyle={{ bottom: 16, right: 16 }}
            toastOptions={{
              style: {
                background: "transparent",
                boxShadow: "none",
                padding: 0,
                margin: 0,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
