"use client";

import { IUser } from "@/types/user";
import { buildCardStyle } from "@/utils/buildCardStyle";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoQrCode } from "react-icons/io5";
import { CardLinksList } from "../CardLinksList/CardLinksList";
import { CardQr } from "../CardQr/CardQr";
import styles from "./PublicCard.module.scss";

export function PublicCard({ user, cardUrl }: { user: IUser; cardUrl: string }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardStyle = buildCardStyle(user.styles);

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.card} ${isFlipped ? styles.flipped : ""}`} style={cardStyle}>
        <div className={styles.front}>
          <button
            type="button"
            className={styles.flipButton}
            onClick={() => setIsFlipped(true)}
            aria-label="Показати QR-код"
          >
            <IoQrCode />
          </button>

          {user.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.username} className={styles.avatar} />
          )}
          <h1 className={styles.username}>{user.username}</h1>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
          <CardLinksList links={user.links} />
        </div>

        <div className={styles.back}>
          <button
            type="button"
            className={styles.flipButton}
            onClick={() => setIsFlipped(false)}
            aria-label="Повернутись до картки"
          >
            <FaArrowLeft />
          </button>
          <CardQr value={cardUrl} />
        </div>
      </div>
    </div>
  );
}
