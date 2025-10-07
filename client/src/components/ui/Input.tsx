"use client";

import styles from "@/styles/components/Input.module.scss";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className={clsx(styles.inputWrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={clsx(styles.input, error && styles.error)} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
