import { ReactNode } from "react";
import styles from "./ToggleGroup.module.scss";

interface ToggleOption<T extends string> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
}

interface ToggleGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({ options, value, onChange }: ToggleGroupProps<T>) {
  return (
    <div className={styles.group} role="radiogroup">
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          aria-label={option.ariaLabel}
          className={`${styles.option} ${option.value === value ? styles.active : ""}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
