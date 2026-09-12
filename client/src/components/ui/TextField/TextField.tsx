"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import styles from "./TextField.module.scss";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, id, type = "text", ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const getInputType = () => {
      if (!isPassword) return type;
      return showPassword ? "text" : "password";
    };

    const inputType = getInputType();

    return (
      <div className={styles.field}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <div className={styles.inputWrapper}>
          <input
            id={id}
            ref={ref}
            type={inputType}
            className={`${styles.input} ${error ? styles.inputError : ""} ${
              isPassword ? styles.inputWithIcon : ""
            }`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              className={styles.toggleButton}
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          )}
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }
);

TextField.displayName = "TextField";
