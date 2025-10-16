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
import { getLinkIcon, getNormalizedLink } from "@/utils/linkUtils";
import * as fonts from "@/constants/fonts";
import Loader from "@/components/modals/Loader";
import Select from "@/components/ui/Select";
import ErrorPage from "@/app/error";
import styles from "@/styles/pages/User.module.scss";

export default function UserPage() {
  const router = useRouter();
  const { username } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<"ua" | "en" | "es">("ua");

  const languageOptions = [
    { value: "ua", label: "UA" },
    { value: "en", label: "EN" },
    { value: "es", label: "ES" }
  ];

  useEffect(() => {
    const usernameStr = Array.isArray(username) ? username[0] : username;
    if (!usernameStr) return;

    const initPage = async () => {
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

    initPage();
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

  if (isLoading) {
    return <Loader isOpen={true} />;
  }

  if (!user) {
    return error ? (
      <ErrorPage
        error={error || new Error(t("user-page.userNotFound"))}
        reset={() => router.refresh()}
      />
    ) : (
      <Loader isOpen={true} />
    );
  }

  const s = user.styles || {};
  const fontClassName = getFontClassName(s.font);

  const backgroundStyle: React.CSSProperties =
    s.background?.type === "color"
      ? { backgroundColor: s.background.value.color }
      : s.background?.type === "gradient"
        ? {
            background: `linear-gradient(${s.background.value.gradient?.angle || "135deg"}, ${
              s.background.value.gradient?.start
            }, ${s.background.value.gradient?.end})`
          }
        : s.background?.type === "image"
          ? {
              backgroundImage: `url(${s.background.value.image})`,
              backgroundPosition: s.background.value.position,
              backgroundSize: s.background.value.size,
              backgroundRepeat: s.background.value.repeat
            }
          : {};

  const cardStyle: React.CSSProperties = {
    ...(s.contentBackground && { backgroundColor: s.contentBackground }),
    ...(s.border && { border: `1px solid ${s.border}` }),
    ...(s.borderRadius && { borderRadius: s.borderRadius }),
    ...(s.text && { color: s.text }),
    ...(s.font && { fontFamily: s.font }),
    ...(s.fontSize && { fontSize: s.fontSize }),
    ...(s.fontWeight && { fontWeight: s.fontWeight }),
    ...(s.textAlign && { textAlign: s.textAlign as "center" | "right" | "left" }),
    ...(s.contentPadding && { padding: s.contentPadding }),
    ...(s.contentGap && { gap: s.contentGap })
  };

  const linkStyle: React.CSSProperties = {
    ...(s.buttonText && { color: s.buttonText }),
    ...(s.buttonBackground && { backgroundColor: s.buttonBackground }),
    ...(s.borderRadius && { borderRadius: s.borderRadius })
  };

  const linkHoverStyle: React.CSSProperties = {
    ...(s.buttonHoverBackground && { backgroundColor: s.buttonHoverBackground }),
    ...(s.buttonHoverText && { color: s.buttonHoverText })
  };

  const textStyle: React.CSSProperties = { ...(s.text && { color: s.text }) };

  const qrButtonStyle: React.CSSProperties = { color: s.text };
  const qrButtonHoverStyle: React.CSSProperties = { color: s.buttonHoverBackground };

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://linkcard.vercel.app/${username}`;

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
          style={{
            ...(s.contentBackground && { backgroundColor: s.contentBackground }),
            ...(s.text && { color: s.text }),
            ...(s.borderRadius && { borderRadius: s.borderRadius }),
            ...(s.border && { border: `1px solid ${s.border}` }),
            ...(s.font && { fontFamily: s.font }),
            ...(s.fontSize && { fontSize: s.fontSize })
          }}
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
                style={qrButtonStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, qrButtonHoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, qrButtonStyle)}
              >
                <BsQrCode aria-hidden="true" />
              </button>

              {isOwner && (
                <button
                  aria-label={t("user-page.showEditPage")}
                  className={styles.qrButton}
                  onClick={() => router.push(`${window.location.pathname}/edit`)}
                  style={qrButtonStyle}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, qrButtonHoverStyle)}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, qrButtonStyle)}
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
              {user.links.map((link, idx) => {
                const url = link.url.trim();
                const normalizedUrl = getNormalizedLink(url);
                return (
                  <a
                    key={idx}
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkBlock}
                    style={linkStyle}
                    onMouseEnter={e => Object.assign(e.currentTarget.style, linkHoverStyle)}
                    onMouseLeave={e => Object.assign(e.currentTarget.style, linkStyle)}
                  >
                    <span className={styles.linkTitle}>{link.title || link.url}</span>
                    <span className={styles.linkIcon}>{getLinkIcon(url)}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* BACK */}
          <div className={`${styles.cardFace} ${styles.back}`} style={cardStyle}>
            <div className={styles.topButtons}>
              <button
                className={styles.qrButton}
                onClick={() => setFlipped(false)}
                style={qrButtonStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, qrButtonHoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, qrButtonStyle)}
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
