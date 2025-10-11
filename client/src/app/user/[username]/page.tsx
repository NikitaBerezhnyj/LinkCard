"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import { userService } from "@/services/UserService";
import { IUser } from "@/types/IUser";
import styles from "@/styles/pages/User.module.scss";
import { BsQrCode } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import QRCode from "react-qr-code";
import { authService } from "@/services/AuthService";
import { FaUserCircle } from "react-icons/fa";
import { getLinkIcon, getNormalizedLink } from "@/utils/linkUtils";
import * as fonts from "@/constants/fonts";
import Link from "next/link";

export default function UserPage() {
  const router = useRouter();
  const { username } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const usernameStr = Array.isArray(username) ? username[0] : username;
    if (!usernameStr) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);

        const res = await userService.getUser(usernameStr);
        if (!res.data) throw new Error("User not found");

        const userData = res.data.data;
        setUser(userData);

        const currentUser = (await authService.getCurrentUser()) as IUser | null;

        if (currentUser && currentUser.username === userData.username) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  function getFontClassName(fontName?: string): string | undefined {
    if (!fontName) return undefined;
    const key = fontName.replace(/\s+/g, "").toLowerCase();
    const fontObj = (fonts as Record<string, { className: string }>)[key];
    return fontObj?.className;
  }

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error || !user) return <p className={styles.error}>{error || "User not found."}</p>;

  const s = user.styles || {};

  const fontClassName = getFontClassName(s.font);

  const backgroundStyle: React.CSSProperties = s.background
    ? s.background.type === "color"
      ? { backgroundColor: s.background.value.color }
      : s.background.type === "gradient"
        ? {
            background: `linear-gradient(${s.background.value.gradient?.angle || "135deg"}, ${
              s.background.value.gradient?.start
            }, ${s.background.value.gradient?.end})`
          }
        : s.background.type === "image"
          ? {
              backgroundImage: `url(${s.background.value.image})`,
              backgroundPosition: s.background.value.position,
              backgroundSize: s.background.value.size,
              backgroundRepeat: s.background.value.repeat
            }
          : {}
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
      <Link href="/" className={styles.logoLink} style={{ color: s.text }}>
        LinkCard
      </Link>
      <div className={`${styles.cardContainer} ${flipped ? styles.flipped : ""}`}>
        <div className={styles.card}>
          {/* FRONT */}
          <div className={`${styles.cardFace} ${styles.front}`} style={cardStyle}>
            <div className={styles.topButtons}>
              <button
                className={styles.qrButton}
                onClick={() => setFlipped(true)}
                style={qrButtonStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, qrButtonHoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, qrButtonStyle)}
              >
                <BsQrCode />
              </button>
              {isOwner && (
                <button
                  className={styles.qrButton}
                  onClick={() => router.push(`${window.location.pathname}/edit`)}
                  style={qrButtonStyle}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, qrButtonHoverStyle)}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, qrButtonStyle)}
                >
                  <MdEdit />
                </button>
              )}
            </div>

            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                width={150}
                height={150}
                unoptimized={true}
                className={styles.avatar}
                style={{
                  ...(s.border && { border: `2px solid ${s.border}` })
                }}
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
              <h1 style={textStyle}>QR code</h1>
              <div
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
                Scan to open this profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
