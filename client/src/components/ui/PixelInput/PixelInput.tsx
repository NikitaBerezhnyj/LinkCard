"use client";

import styles from "./PixelInput.module.scss";

interface PixelInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  unit?: string;
}

function parseValue(value?: string): number {
  if (!value) return 0;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function PixelInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  unit = "px"
}: PixelInputProps) {
  const numericValue = parseValue(value);

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.control}>
        <input
          type="range"
          min={min}
          max={max}
          value={numericValue}
          onChange={e => onChange(`${e.target.value}${unit}`)}
          className={styles.slider}
        />
        <span className={styles.value}>
          {numericValue}
          {unit}
        </span>
      </div>
    </div>
  );
}
