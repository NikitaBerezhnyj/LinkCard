"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import { BsQrCode } from "react-icons/bs";
import { FaRegAddressCard, FaUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IUser } from "@/types/IUser";
import { userService } from "@/services/UserService";
import { accessManager } from "@/managers/accessManager";
import * as fonts from "@/constants/fonts";
import Loader from "@/components/modals/Loader";
import Select from "@/components/ui/Select";
import ErrorPage from "@/app/error";
import styles from "@/styles/pages/User.module.scss";
import { Languages } from "@/i18n";
import { LinkItem } from "@/components/ui/LinkItem";
import {
  getCardStyle,
  getLinkStyle,
  getLinkHoverStyle,
  getBackgroundStyle,
  getDynamicStyles
} from "@/utils/styleHelpers";

export default function UserPage() {
  const router = useRouter();
  const { username } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<Languages>("en");

  const languageOptions = [
    { value: "ua", label: "UA" },
    { value: "en", label: "EN" },
    { value: "es", label: "ES" }
  ];

  useEffect(() => {
    const fetchUserData = async (usernameStr: string) => {
      setIsLoading(true);
      try {
        const currentUsername = await accessManager.getCurrentUserCached();
        const res = await userService.getUser(usernameStr);
        const userData = res?.data?.data;

        if (!userData) {
          setError(new Error(t("user-page.userNotFound")));
          setUser(null);
          return;
        }

        setUser(userData);
        setError(null);
        setIsOwner(currentUsername === userData.username);
      } catch (err) {
        console.error("Fetch user failed:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const usernameStr = Array.isArray(username) ? username[0] : username;
    if (!usernameStr) return;
    fetchUserData(usernameStr);
  }, [username, t]);

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

  const getFontClassName = (fontName?: string): string | undefined => {
    if (!fontName) return undefined;
    const key = fontName.replace(/\s+/g, "").toLowerCase();
    const fontObj = (fonts as Record<string, { className: string }>)[key];
    return fontObj?.className;
  };

  const buttonHoverProps = (style: React.CSSProperties, hoverStyle: React.CSSProperties) => ({
    style,
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) =>
      Object.assign(e.currentTarget.style, hoverStyle),
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) =>
      Object.assign(e.currentTarget.style, style)
  });

  if (isLoading) {
    return <Loader isOpen={true} />;
  }

  if (!user) {
    return (
      <ErrorPage
        error={error ?? new Error(t("user-page.userNotFound"))}
        reset={() => router.refresh()}
      />
    );
  }

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://linkcard.vercel.app/${username}`;

  const s = user.styles || {};
  const cardStyle = getCardStyle(s);
  const linkStyle = getLinkStyle(s);
  const linkHoverStyle = getLinkHoverStyle(s);
  const fontClassName = getFontClassName(s.font);
  const backgroundStyle = getBackgroundStyle(s.background);
  const { textStyle, qrButtonStyle, qrButtonHoverStyle, selectStyle } = getDynamicStyles(s);

  return (
    <main className={`${styles.mainWrapper} ${fontClassName || ""}`} style={backgroundStyle}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logoLink} style={{ color: s.text }}>
          LinkCard
        </Link>

        <Select
          options={languageOptions}
          value={language}
          onChange={handleLanguageChange}
          className={styles.languageSelect}
          style={selectStyle}
          arrowColor={s.text}
          aria-label={t("user-page.languageSelector")}
        />
      </div>

      <div className={`${styles.cardContainer} ${flipped ? styles.flipped : ""}`}>
        <div className={styles.card}>
          {/* FRONT */}
          <div className={`${styles.cardFace} ${styles.front}`} style={cardStyle}>
            <div className={styles.topButtons}>
              <button
                aria-label={t("user-page.showQrCode")}
                className={styles.qrButton}
                onClick={() => setFlipped(true)}
                {...buttonHoverProps(qrButtonStyle, qrButtonHoverStyle)}
              >
                <BsQrCode aria-hidden="true" />
              </button>

              {isOwner && (
                <button
                  aria-label={t("user-page.showEditPage")}
                  className={styles.qrButton}
                  onClick={() => router.push(`${window.location.pathname}/edit`)}
                  {...buttonHoverProps(qrButtonStyle, qrButtonHoverStyle)}
                >
                  <MdEdit aria-hidden="true" />
                </button>
              )}
            </div>

            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={t("user-page.avatarAlt", { username: user.username })}
                width={150}
                height={150}
                unoptimized
                className={styles.avatar}
                style={s.border ? { border: `2px solid ${s.border}` } : {}}
              />
            ) : (
              <FaUserCircle className={styles.avatarPlaceholder} style={textStyle} />
            )}

            <h1 style={textStyle}>{user.username}</h1>
            {user.bio && <p style={textStyle}>{user.bio}</p>}

            <div className={styles.links}>
              {user.links.map((link, idx) => (
                <LinkItem
                  key={idx}
                  link={link}
                  idx={idx}
                  linkStyle={linkStyle}
                  linkHoverStyle={linkHoverStyle}
                />
              ))}
            </div>
          </div>

          {/* BACK */}
          <div className={`${styles.cardFace} ${styles.back}`} style={cardStyle}>
            <div className={styles.topButtons}>
              <button
                className={styles.qrButton}
                onClick={() => setFlipped(false)}
                {...buttonHoverProps(qrButtonStyle, qrButtonHoverStyle)}
              >
                <FaRegAddressCard />
              </button>
            </div>

            <div className={styles.qrWrapper}>
              <h1 style={textStyle}>{t("user-page.qrCodeTitle")}</h1>
              <div
                aria-label={t("user-page.qrCodeAlt", { username: user.username })}
                className={styles.qrCodeContainer}
                style={{
                  borderColor: s.buttonHoverBackground,
                  backgroundColor: s.contentBackground
                }}
              >
                <QRCode
                  value={currentUrl}
                  bgColor={s.text}
                  fgColor={s.contentBackground}
                  size={200}
                />
              </div>
              <p className={styles.qrText} style={textStyle}>
                {t("user-page.scanProfile")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
