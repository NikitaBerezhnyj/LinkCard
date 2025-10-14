"use client";

import styles from "@/styles/pages/Error.module.scss";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { TbError404 } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { isAuth } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <Header isAuth={isAuth} />
      <main className={styles.errorWrapper}>
        <div className={styles.content}>
          <TbError404 className={styles.icon} />
          <h1>{t("not-found.title")}</h1>
          <p>{t("not-found.message")}</p>
          <div className={styles.buttons}>
            <Link href="/">
              <Button className="primary">{t("not-found.goHome")}</Button>
            </Link>
            {!isAuth && (
              <Link href="/register">
                <Button className="secondary">{t("not-found.createAccount")}</Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
