import { TextareaHTMLAttributes, forwardRef } from "react";
import styles from "./Textarea.module.scss";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, ...rest }, ref) => (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <textarea
        id={id}
        ref={ref}
        className={`${styles.textarea} ${error ? styles.textareaError : ""}`}
        {...rest}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
);

Textarea.displayName = "Textarea";
