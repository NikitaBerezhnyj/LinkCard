"use client";

import Link from "next/link";
import styles from "@/styles/components/Header.module.scss";
import { useUserStore } from "@/store/userStore";
import { useState, useEffect } from "react";
import Select from "@/components/ui/Select";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  isAuth: boolean;
}

export default function Header({ isAuth }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { username } = useUserStore();
  const [language, setLanguage] = useState<"ua" | "en" | "es">("ua");

  const languageOptions = [
    { value: "ua", label: "UA" },
    { value: "en", label: "EN" },
    { value: "es", label: "ES" }
  ];

  useEffect(() => {
    const current = i18n.language.toLowerCase();
    if (["ua", "en", "es"].includes(current)) {
      setLanguage(current as "ua" | "en" | "es");
    } else {
      setLanguage("en");
    }
  }, [i18n.language]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as "ua" | "en" | "es";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          LinkCard
        </Link>

        <nav className={styles.nav}>
          <Select
            options={languageOptions}
            value={language}
            onChange={handleLanguageChange}
            className={styles.languageSelect}
          />

          {!isAuth ? (
            <button
              className={styles.loginButton}
              onClick={() => (window.location.href = "/login")}
            >
              {t("header.login")}
            </button>
          ) : (
            <button
              className={styles.profileButton}
              onClick={() => (window.location.href = `/user/${username}`)}
            >
              {t("header.profile")}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
