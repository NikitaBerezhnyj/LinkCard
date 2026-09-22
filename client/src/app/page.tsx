import { FeaturesSection } from "@/components/landing/FeaturesSection/FeaturesSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection/FinalCtaSection";
import { HeroSection } from "@/components/landing/HeroSection/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader/LandingHeader";
import { PreviewSection } from "@/components/landing/PreviewSection/PreviewSection";
import { SearchSection } from "@/components/landing/SearchSection/SearchSection";
import type { Metadata } from "next";

const siteUrl = "https://linkcard.example.com"; // TODO: реальний домен

export const metadata: Metadata = {
  title: "LinkCard",
  description:
    "Створи персональну link-in-bio картку: зберігай всі свої посилання, соцмережі та контакти в одному місці, кастомізуй вигляд і ділись через QR-код.",
  keywords: [
    "link in bio",
    "лінк ін біо",
    "персональна візитка",
    "цифрова візитка",
    "QR код профіль",
    "linkcard"
  ],
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteUrl,
    title: "LinkCard",
    description: "Персональна link-in-bio картка з посиланнями, стилем та QR-кодом.",
    siteName: "LinkCard"
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkCard",
    description: "Персональна link-in-bio картка з кастомним стилем і QR-кодом."
  }
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "LinkCard",
    url: siteUrl,
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description:
      "LinkCard — сервіс для створення персональної link-in-bio картки з посиланнями, кастомним стилем та QR-кодом."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingHeader />
      <main>
        <HeroSection />
        <SearchSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PreviewSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
