"use client";

import { PixelInput } from "@/components/ui/PixelInput/PixelInput";
import { ToggleGroup } from "@/components/ui/ToggleGroup/ToggleGroup";
import { IFontWeight, ITextAlign, ITypography } from "@/types/styles";
import { ReactNode } from "react";
import { FaAlignCenter, FaAlignLeft, FaAlignRight } from "react-icons/fa6";
import styles from "./Controls.module.scss";

const FONT_OPTIONS = [
  { value: "Manrope, sans-serif", label: "Manrope (стандартний)" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: '"Courier New", monospace', label: "Courier New" },
  { value: '"Trebuchet MS", sans-serif', label: "Trebuchet MS" }
];

const WEIGHT_OPTIONS: { value: IFontWeight; label: string }[] = [
  { value: "400", label: "Звичайний" },
  { value: "600", label: "Напівжирний" },
  { value: "700", label: "Жирний" }
];

const ALIGN_OPTIONS: { value: ITextAlign; label: ReactNode; ariaLabel: string }[] = [
  { value: "left", label: <FaAlignLeft />, ariaLabel: "Зліва" },
  { value: "center", label: <FaAlignCenter />, ariaLabel: "По центру" },
  { value: "right", label: <FaAlignRight />, ariaLabel: "Справа" }
];

interface TypographyControlsProps {
  value: ITypography;
  onChange: (patch: Partial<ITypography>) => void;
}

export function TypographyControls({ value, onChange }: TypographyControlsProps) {
  return (
    <div className={styles.grid}>
      <div className={styles.selectField}>
        <span className={styles.label}>Шрифт</span>
        <select
          className={styles.select}
          value={value.font ?? FONT_OPTIONS[0].value}
          onChange={e => onChange({ font: e.target.value })}
        >
          {FONT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <PixelInput
        label="Розмір тексту"
        value={value.fontSize}
        onChange={fontSize => onChange({ fontSize })}
        min={12}
        max={32}
      />

      <div className={styles.selectField}>
        <span className={styles.label}>Насиченість</span>
        <select
          className={styles.select}
          value={value.fontWeight ?? "400"}
          onChange={e => onChange({ fontWeight: e.target.value as IFontWeight })}
        >
          {WEIGHT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.selectField}>
        <span className={styles.label}>Вирівнювання</span>
        <ToggleGroup
          options={ALIGN_OPTIONS}
          value={value.textAlign ?? "center"}
          onChange={textAlign => onChange({ textAlign })}
        />
      </div>
    </div>
  );
}
