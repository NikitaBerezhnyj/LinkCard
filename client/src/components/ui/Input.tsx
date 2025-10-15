"use client";

import styles from "@/styles/components/Input.module.scss";
import clsx from "clsx";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useTranslation } from "react-i18next";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export default function Input({
  label,
  error,
  showPasswordToggle,
  type,
  className,
  ...props
}: InputProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";

  const inputId = props.id || `input-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={clsx(styles.inputWrapper, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          type={isPasswordType && showPasswordToggle ? (showPassword ? "text" : "password") : type}
          className={clsx(styles.input, error && styles.error)}
          {...props}
        />
        {isPasswordType && showPasswordToggle && (
          <button
            type="button"
            aria-label={showPassword ? t("input.hidePassword") : t("input.showPassword")}
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        )}
      </div>
      {error && (
        <span id={errorId} className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
}
