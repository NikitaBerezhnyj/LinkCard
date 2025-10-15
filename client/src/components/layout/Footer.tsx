"use client";

import styles from "@/styles/components/Footer.module.scss";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer} aria-label={t("footer.siteFooter")}>
      <div className={styles.container}>
        <p>
          © {new Date().getFullYear()} LinkCard. {t("footer.allRightsReserved")}
        </p>
      </div>
    </footer>
  );
}
