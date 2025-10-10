import {
  Inter,
  Roboto,
  Open_Sans,
  Shadows_Into_Light,
  Raleway,
  Montserrat,
  Barrio,
  Delius,
  Audiowide,
  Merriweather
} from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto"
});

export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-inter"
});

export const openSans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans"
});

export const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin", "cyrillic"] as unknown as ("latin" | "latin-ext")[],
  weight: ["400"],
  variable: "--font-shadows-into-light"
});

export const raleway = Raleway({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-raleway"
});

export const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat"
});

export const barrio = Barrio({
  subsets: ["latin", "cyrillic"] as unknown as ("latin" | "latin-ext")[],
  weight: ["400"],
  variable: "--font-barrio"
});

export const delius = Delius({
  subsets: ["latin"],
  weight: ["400", "400"],
  variable: "--font-delius"
});

export const audiowide = Audiowide({
  subsets: ["latin", "cyrillic"] as unknown as ("latin" | "latin-ext")[],
  weight: ["400"],
  variable: "--font-audiowide"
});

export const merriweather = Merriweather({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-merriweather"
});
