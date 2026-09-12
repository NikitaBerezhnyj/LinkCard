import type { Metadata } from "next";
import { Piazzolla, Manrope, Space_Mono } from "next/font/google";
import { Providers } from "./providers";
import "@/styles/globals.scss";

const piazzolla = Piazzolla({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-piazzolla",
  display: "swap"
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-manrope",
  display: "swap"
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "LinkCard",
  description: "Create and share your personal profile with all your links in one place"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${piazzolla.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
