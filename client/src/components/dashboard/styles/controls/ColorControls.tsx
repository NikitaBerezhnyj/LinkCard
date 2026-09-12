"use client";

import { ColorField } from "@/components/ui/ColorField/ColorField";
import { IButtonColors, IColorScheme } from "@/types/styles";
import styles from "./Controls.module.scss";

interface ColorControlsProps {
  value: IColorScheme;
  onChange: (patch: Partial<IColorScheme>) => void;
  onButtonChange: (patch: Partial<IButtonColors>) => void;
}

export function ColorControls({ value, onChange, onButtonChange }: ColorControlsProps) {
  return (
    <>
      <div className={styles.grid}>
        <ColorField label="Текст" value={value.text} onChange={text => onChange({ text })} />
        <ColorField
          label="Текст посилань"
          value={value.linkText}
          onChange={linkText => onChange({ linkText })}
        />
        <ColorField label="Рамка" value={value.border} onChange={border => onChange({ border })} />
        <ColorField
          label="Фон контенту"
          value={value.contentBackground}
          onChange={contentBackground => onChange({ contentBackground })}
        />
      </div>

      <p className={styles.subheading}>Кнопки посилань</p>
      <div className={styles.grid}>
        <ColorField
          label="Текст"
          value={value.button.text}
          onChange={text => onButtonChange({ text })}
        />
        <ColorField
          label="Фон"
          value={value.button.background}
          onChange={background => onButtonChange({ background })}
        />
        <ColorField
          label="Текст при наведенні"
          value={value.button.hoverText}
          onChange={hoverText => onButtonChange({ hoverText })}
        />
        <ColorField
          label="Фон при наведенні"
          value={value.button.hoverBackground}
          onChange={hoverBackground => onButtonChange({ hoverBackground })}
        />
      </div>
    </>
  );
}
