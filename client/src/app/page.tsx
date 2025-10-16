"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/pages/Home.module.scss";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { IoIosShareAlt } from "react-icons/io";
import { MdSecurity, MdDesignServices } from "react-icons/md";
import Loader from "@/components/modals/Loader";
import { useTranslation } from "react-i18next";
import { accessManager } from "@/managers/accessManager";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const username = await accessManager.getCurrentUserCached();
        if (username) {
          setIsAuth(true);
          setUsername(username);
        } else {
          setIsAuth(false);
        }
      } catch {
        setIsAuth(false);
      } finally {
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    checkAccess();
  }, []);

  if (isLoading) {
    return <Loader isOpen={isLoading} />;
  }

  return (
    <>
      <Header isAuth={isAuth} />
      <main className={styles.homeWrapper} aria-busy={isLoading}>
        <section className={`${styles.section} ${styles.hero}`}>
          <div className={styles.content}>
            <h1>
              {isAuth && username ? (
                <>{t("home.greeting", { username })}</>
              ) : (
                <>
                  {t("home.guestGreeting")} <span>LinkCard</span>
                </>
              )}
            </h1>
            <p>{isAuth ? t("home.heroMessageAuth") : t("home.heroMessageGuest")}</p>
            {!isLoading && (
              <div className={styles.buttons}>
                {isAuth && username ? (
                  <>
                    <Link href={`/user/${username}`}>
                      <Button role="button" tabIndex={0}>
                        {t("home.goToProfile")}
                      </Button>
                    </Link>
                    <Link href={`/user/${username}/edit`}>
                      <Button role="button" tabIndex={1}>
                        {t("home.editPage")}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/register">
                      <Button role="button" tabIndex={0}>
                        {t("home.startNow")}
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button role="button" tabIndex={1}>
                        {t("home.login")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        <section className={`${styles.section} ${styles.features}`}>
          <h2>{t("home.featuresTitle")}</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <MdDesignServices size={60} aria-hidden="true" />
              <h3>{t("home.featureCustom")}</h3>
              <p>{t("home.featureCustomDesc")}</p>
            </div>
            <div className={styles.featureCard}>
              <IoIosShareAlt size={60} aria-hidden="true" />
              <h3>{t("home.featureShare")}</h3>
              <p>{t("home.featureShareDesc")}</p>
            </div>
            <div className={styles.featureCard}>
              <MdSecurity size={60} aria-hidden="true" />
              <h3>{t("home.featureSecure")}</h3>
              <p>{t("home.featureSecureDesc")}</p>
            </div>
          </div>
        </section>

        {!isAuth && (
          <section className={`${styles.section} ${styles.cta}`}>
            <div className={styles.ctaContent}>
              <h2>{t("home.ctaTitle")}</h2>
              <p>{t("home.ctaDesc")}</p>
              <Link href="/register">
                <Button>{t("home.ctaButton")}</Button>
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
