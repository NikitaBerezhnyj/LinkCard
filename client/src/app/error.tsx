"use client";

import { useEffect } from "react";
import styles from "@/styles/pages/Error.module.scss";
import Button from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { FaRegSadTear } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const { isAuth } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header isAuth={isAuth} />
      <main className={styles.errorWrapper}>
        <div className={styles.content}>
          <FaRegSadTear className={styles.icon} />
          <h1>{t("error.title")}</h1>
          <p>
            {t("error.message")}: {error.message}
          </p>
          <div className={styles.buttons}>
            <Button onClick={reset}>{t("error.tryAgain")}</Button>
            <Button onClick={() => (window.location.href = "/")}>{t("error.goHome")}</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
