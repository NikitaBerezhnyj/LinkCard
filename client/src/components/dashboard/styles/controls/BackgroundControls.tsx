"use client";

import { Button } from "@/components/ui/Button/Button";
import { ColorField } from "@/components/ui/ColorField/ColorField";
import { PixelInput } from "@/components/ui/PixelInput/PixelInput";
import { ToggleGroup } from "@/components/ui/ToggleGroup/ToggleGroup";
import { IBackground, IBackgroundRepeat, IBackgroundSize, IBackgroundType } from "@/types/styles";
import { ChangeEvent, useRef } from "react";
import { useUploadBackground } from "@/hooks/dashboard/useUploadBackground";
import styles from "./Controls.module.scss";

const TYPE_OPTIONS: { value: IBackgroundType; label: string }[] = [
  { value: "color", label: "Колір" },
  { value: "gradient", label: "Градієнт" },
  { value: "image", label: "Зображення" }
];

const REPEAT_OPTIONS: { value: IBackgroundRepeat; label: string }[] = [
  { value: "no-repeat", label: "Без повтору" },
  { value: "repeat", label: "Повторювати" }
];

const SIZE_OPTIONS: { value: IBackgroundSize; label: string }[] = [
  { value: "cover", label: "На всю картку" },
  { value: "contain", label: "Вписати" },
  { value: "auto", label: "Оригінал" }
];

interface BackgroundControlsProps {
  value: IBackground;
  onTypeChange: (type: IBackgroundType) => void;
  onChange: (patch: Partial<IBackground>) => void;
}

export function BackgroundControls({ value, onTypeChange, onChange }: BackgroundControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadBackground = useUploadBackground();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    uploadBackground.mutate(file, {
      onSuccess: ({ backgroundUrl }) => {
        onChange({ image: backgroundUrl });
        onTypeChange("image");
      }
    });
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
          value={value.color}
          onChange={color => onChange({ color })}
        />
      )}

      {value.type === "gradient" && (
        <div className={styles.grid}>
          <ColorField
            label="Початковий колір"
            value={value.gradient?.start}
            onChange={start => onChange({ gradient: { ...value.gradient, start } })}
          />
          <ColorField
            label="Кінцевий колір"
            value={value.gradient?.end}
            onChange={end => onChange({ gradient: { ...value.gradient, end } })}
          />
          <PixelInput
            label="Кут"
            value={value.gradient?.angle}
            onChange={angle => onChange({ gradient: { ...value.gradient, angle } })}
            max={360}
            unit="deg"
          />
        </div>
      )}

      {value.type === "image" && (
        <>
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
              disabled={uploadBackground.isPending}
            >
              {uploadBackground.isPending ? "Завантаження..." : "Завантажити зображення"}
            </Button>
          </div>
          <div className={styles.grid}>
            <div className={styles.selectField}>
              <span className={styles.label}>Повторення</span>
              <ToggleGroup
                options={REPEAT_OPTIONS}
                value={value.repeat ?? "no-repeat"}
                onChange={repeat => onChange({ repeat })}
              />
            </div>
            <div className={styles.selectField}>
              <span className={styles.label}>Розмір</span>
              <ToggleGroup
                options={SIZE_OPTIONS}
                value={value.size ?? "cover"}
                onChange={size => onChange({ size })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
