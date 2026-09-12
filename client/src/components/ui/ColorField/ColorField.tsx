"use client";

import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import styles from "./ColorField.module.scss";

interface ColorFieldProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const color = value || "#ffffff";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.field} ref={wrapperRef}>
      <span className={styles.label}>{label}</span>
      <div className={styles.control}>
        <button
          type="button"
          className={styles.swatch}
          style={{ background: color }}
          onClick={() => setIsOpen(prev => !prev)}
          aria-label={`Обрати колір для «${label}»`}
        />
        <input
          type="text"
          className={styles.hexInput}
          value={color}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      {isOpen && (
        <div className={styles.popover}>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
