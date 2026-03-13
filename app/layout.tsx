import type { Metadata } from "next";
import { Barlow_Condensed, Cinzel, Silkscreen } from "next/font/google";

import "@/app/globals.css";

const displayFont = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const pixelFont = Silkscreen({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "What's Your True Main?",
  description:
    "A dramatic League-inspired personality quiz that reveals your true main through ego, mechanics, tilt, and pure solo queue delusion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${pixelFont.variable} min-h-screen bg-abyss font-sans text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
