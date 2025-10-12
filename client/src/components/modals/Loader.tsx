"use client";

import React from "react";
import styles from "@/styles/components/Loader.module.scss";

interface LoaderProps {
  isOpen: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
      </div>
    </div>
  );
};

export default Loader;
