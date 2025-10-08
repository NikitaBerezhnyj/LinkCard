"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { userService } from "@/services/UserService";
import { IUser } from "@/types/IUser";
import styles from "@/styles/pages/User.module.scss";
import { FiLink, FiMail } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaTelegram, FaGithub, FaUserCircle } from "react-icons/fa";
import { BsQrCode } from "react-icons/bs";
import { FaRegAddressCard } from "react-icons/fa";
import QRCode from "react-qr-code";

export default function UserPage() {
  const { username } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);

  function getLinkIcon(url: string) {
    const lower = url.toLowerCase();

    if (lower.includes("@") && !lower.startsWith("http")) return <FiMail />;

    let hostname = "";
    try {
      hostname = new URL(url).hostname.replace("www.", "").toLowerCase();
    } catch {
      return <FiLink />;
    }

    if (hostname.includes("facebook")) return <FaFacebook />;
    if (hostname.includes("twitter")) return <FaTwitter />;
    if (hostname.includes("telegram")) return <FaTelegram />;
    if (hostname.includes("github")) return <FaGithub />;

    return <FiLink />;
  }

  useEffect(() => {
    const usernameStr = Array.isArray(username) ? username[0] : username;
    if (!usernameStr) return;

    setLoading(true);
    userService
      .getUser(usernameStr)
      .then(res => {
        if (!res.data) throw new Error("User not found");
        setUser(res.data?.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load user.");
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p className={styles.error}>User not found.</p>;

  const s = user.styles || {};

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

  const currentUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://linkcard.vercel.app/${username}`;

  return (
    <main className={styles.mainWrapper} style={backgroundStyle}>
      <div className={`${styles.cardContainer} ${flipped ? styles.flipped : ""}`}>
        <div className={styles.card}>
          {/* FRONT SIDE */}
          <div className={`${styles.cardFace} ${styles.front}`}>
            <button className={styles.qrButton} onClick={() => setFlipped(true)}>
              <BsQrCode />
            </button>

            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                width={150}
                height={150}
                className={styles.avatar}
              />
            ) : (
              <FaUserCircle className={styles.avatarPlaceholder} />
            )}

            <h1 style={{ color: s.text }}>{user.username}</h1>
            {user.bio && <p style={{ color: s.text }}>{user.bio}</p>}

            <div className={styles.links}>
              {user.links.map((link, idx) => (
                <a
                  key={idx}
                  href={
                    link.url.includes("@") && !link.url.startsWith("http")
                      ? `mailto:${link.url}`
                      : link.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkBlock}
                  style={{ color: s.linkText }}
                >
                  <span className={styles.linkIcon}>{getLinkIcon(link.url)}</span>
                  <span className={styles.linkTitle}>{link.title || link.url}</span>
                </a>
              ))}
            </div>
          </div>

          {/* BACK SIDE */}
          <div className={`${styles.cardFace} ${styles.back}`}>
            <button className={styles.qrButton} onClick={() => setFlipped(false)}>
              <FaRegAddressCard />
            </button>
            <div className={styles.qrWrapper}>
              <h1>QR code</h1>
              <div className={styles.qrCodeContainer}>
                <QRCode value={currentUrl} bgColor="#ffffff" fgColor="#000000" size={200} />
              </div>
              <p className={styles.qrText}>Scan to open this profile</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
