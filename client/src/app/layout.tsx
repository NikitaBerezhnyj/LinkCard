import "@/styles/globals.scss";
import type { Metadata } from "next";
import {
  Caveat,
  JetBrains_Mono,
  Manrope,
  Piazzolla,
  Rubik,
  Space_Mono,
  Unbounded
} from "next/font/google";
import { Providers } from "./providers";

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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-jetbrains-mono",
  display: "swap"
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-unbounded",
  display: "swap"
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-caveat",
  display: "swap"
});

const rubik = Rubik({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-rubik",
  display: "swap"
});

export const metadata: Metadata = {
  title: "LinkCard",
  description: "Create and share your personal profile with all your links in one place"
};

const fontVariables = [
  piazzolla.variable,
  manrope.variable,
  spaceMono.variable,
  jetbrainsMono.variable,
  unbounded.variable,
  caveat.variable,
  rubik.variable
].join(" ");

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={fontVariables}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
