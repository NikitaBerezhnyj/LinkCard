"use client";

import React from "react";
import styles from "@/styles/components/Loader.module.scss";

interface LoaderProps {
  isOpen: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.loader}>
        <div className={styles.spinner} aria-hidden="true"></div>
        <span className={styles.srOnly}>Loading…</span>
      </div>
    </div>
  );
};

export default Loader;
