"use client";

import { QRCodeSVG } from "qrcode.react";
import styles from "./CardQr.module.scss";

export function CardQr({ value }: { value: string }) {
  const displayValue = value ? value.replace(/^https?:\/\//, "") : "";

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <QRCodeSVG value={value} size={176} bgColor="#ffffff" fgColor="#22201b" level="M" />
      </div>
      <p className={styles.caption}>{displayValue}</p>
    </div>
  );
}
