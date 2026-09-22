"use client";

import { Button } from "@/components/ui/Button/Button";
import { ColorField } from "@/components/ui/ColorField/ColorField";
import { ToggleGroup } from "@/components/ui/ToggleGroup/ToggleGroup";
import { IBackground, IBackgroundType } from "@/types/styles";
import { ChangeEvent, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onSelectImage(file);
    event.target.value = "";
  }

  return (
    <div className={styles.grid} style={{ gridTemplateColumns: "1fr" }}>
      <div className={styles.selectField}>
        <span className={styles.label}>Тип фону</span>
        <ToggleGroup options={TYPE_OPTIONS} value={value.type} onChange={onTypeChange} />
      </div>

      {value.type === "color" && (
        <ColorField
          label="Колір фону"
          value={value.color ?? accentColor}
          onChange={color => onChange({ color })}
        />
      )}

      {value.type === "gradient" && (
        <p className={styles.hint}>Градієнт формується автоматично на основі акцентного кольору.</p>
      )}

      {value.type === "image" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Завантаження..." : "Завантажити зображення"}
          </Button>
        </div>
      )}
    </div>
  );
}
