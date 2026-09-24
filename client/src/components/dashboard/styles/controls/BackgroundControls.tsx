"use client";

import { ColorField } from "@/components/ui/ColorField/ColorField";
import { ToggleGroup } from "@/components/ui/ToggleGroup/ToggleGroup";
import { BACKGROUND_COLOR_PRESETS } from "@/constants/colorPresets";
import { IBackground, IBackgroundType } from "@/types/styles";
import { BackgroundImagePicker } from "./BackgroundImagePicker";
import styles from "./Controls.module.scss";

const TYPE_OPTIONS: { value: IBackgroundType; label: string }[] = [
  { value: "color", label: "Колір" },
  { value: "gradient", label: "Градієнт" },
  { value: "image", label: "Зображення" }
];

interface BackgroundControlsProps {
  value: IBackground;
  accentColor: string;
  isUploading: boolean;
  onTypeChange: (type: IBackgroundType) => void;
  onChange: (patch: Partial<IBackground>) => void;
  onSelectImage: (file: File) => void;
}

export function BackgroundControls({
  value,
  accentColor,
  isUploading,
  onTypeChange,
  onChange,
  onSelectImage
}: BackgroundControlsProps) {
  return (
    <div className={styles.stack}>
      <div className={styles.selectField}>
        <span className={styles.label}>Тип фону</span>
        <ToggleGroup options={TYPE_OPTIONS} value={value.type} onChange={onTypeChange} />
      </div>

      {value.type === "color" && (
        <ColorField
          label="Колір фону"
          value={value.color ?? accentColor}
          onChange={color => onChange({ color })}
          presets={BACKGROUND_COLOR_PRESETS}
        />
      )}

      {value.type === "gradient" && (
        <ColorField
          label="Базовий колір градієнту"
          value={value.gradientColor ?? accentColor}
          onChange={gradientColor => onChange({ gradientColor })}
          presets={BACKGROUND_COLOR_PRESETS}
        />
      )}

      {value.type === "image" && (
        <BackgroundImagePicker
          imageUrl={value.image}
          isUploading={isUploading}
          onSelect={onSelectImage}
        />
      )}
    </div>
  );
}
