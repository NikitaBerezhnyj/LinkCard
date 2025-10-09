"use client";

import styles from "@/styles/components/Textarea.module.scss";
import clsx from "clsx";
import { useState, ChangeEvent } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxCharacters?: number;
}

export default function Textarea({
  label,
  error,
  maxCharacters,
  className,
  value = "",
  onChange,
  ...props
}: TextareaProps) {
  const [text, setText] = useState(value as string);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    if (maxCharacters && inputValue.length > maxCharacters) return;

    setText(inputValue);
    onChange?.(e);
  };

  return (
    <div className={clsx(styles.textareaWrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.textareaContainer}>
        <textarea
          className={clsx(styles.textarea, error && styles.error)}
          value={text}
          onChange={handleChange}
          {...props}
        />
      </div>

      {maxCharacters && (
        <div className={styles.charCount}>
          {text.length} / {maxCharacters}
        </div>
      )}

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
