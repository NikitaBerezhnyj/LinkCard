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

  const textareaId = props.id || `textarea-${label?.replace(/\s+/g, "-").toLowerCase()}`;
  const errorId = error ? `${textareaId}-error` : undefined;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    if (maxCharacters && inputValue.length > maxCharacters) return;

    setText(inputValue);
    onChange?.(e);
  };

  return (
    <div className={clsx(styles.textareaWrapper, className)}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.textareaContainer}>
        <textarea
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={clsx(styles.textarea, error && styles.error)}
          value={text}
          onChange={handleChange}
          {...props}
        />
      </div>

      {maxCharacters && (
        <div className={styles.charCount} aria-live="polite">
          {text.length} / {maxCharacters}
        </div>
      )}

      {error && (
        <span id={errorId} className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
}
