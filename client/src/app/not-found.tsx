"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/pages/Error.module.scss";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TbError404 } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { accessManager } from "@/managers/accessManager";

export default function NotFoundPage() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const username = await accessManager.getCurrentUserCached();
        setIsAuth(!!username);
      } catch {
        setIsAuth(false);
      }
    };

    checkAccess();
  }, []);

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
