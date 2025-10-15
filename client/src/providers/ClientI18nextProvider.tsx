"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ReactNode, useEffect } from "react";

export default function ClientI18nextProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = i18n.language || "en";
  }, [i18n.language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
