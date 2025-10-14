"use client";
import styles from "@/styles/components/Select.module.scss";
import clsx from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  style?: React.CSSProperties;
  arrowColor?: string;
  options: { value: string | number; label: string }[];
}

export default function Select({
  label,
  error,
  options,
  className,
  style,
  arrowColor,
  ...props
}: SelectProps) {
  return (
    <div className={clsx(styles.selectWrapper, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectContainer}>
        <select className={clsx(styles.select, error && styles.error)} {...props} style={style}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className={styles.selectArrow} style={{ color: arrowColor || undefined }}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
