"use client";

import { getRandomQrCaption } from "@/utils/getRandomQrCaption";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import styles from "./CardQr.module.scss";

export function CardQr({ value }: { value: string }) {
  const [caption, setCaption] = useState("");

  useEffect(() => {
    setCaption(getRandomQrCaption());
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <QRCodeSVG value={value} size={176} bgColor="#ffffff" fgColor="#22201b" level="M" />
      </div>
      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
