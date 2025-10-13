"use client";

import Link from "next/link";
import styles from "@/styles/components/Header.module.scss";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import Select from "@/components/ui/Select";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  isAuth: boolean;
}

export default function Header({ isAuth }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { username } = useUserStore();
  const [language, setLanguage] = useState<"UA" | "EN" | "ES">("UA");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value.toLowerCase();
    setLanguage(e.target.value as "UA" | "EN" | "ES");
    i18n.changeLanguage(newLang);
    console.log(newLang);
  };

  const languageOptions = [
    { value: "UA", label: "UA" },
    { value: "EN", label: "EN" },
    { value: "ES", label: "ES" }
  ];

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
              {t("login")}
            </button>
          ) : (
            <button
              className={styles.profileButton}
              onClick={() => (window.location.href = `/user/${username}`)}
            >
              {t("profile")}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
