"use client";

import { PixelInput } from "@/components/ui/PixelInput/PixelInput";
import { ILayout } from "@/types/styles";
import styles from "./Controls.module.scss";

interface LayoutControlsProps {
  value: ILayout;
  onChange: (patch: Partial<ILayout>) => void;
}

export function LayoutControls({ value, onChange }: LayoutControlsProps) {
  return (
    <div className={styles.grid}>
      <PixelInput
        label="Заокруглення кутів"
        value={value.borderRadius}
        onChange={borderRadius => onChange({ borderRadius })}
        max={40}
      />
      <PixelInput
        label="Внутрішні відступи"
        value={value.contentPadding}
        onChange={contentPadding => onChange({ contentPadding })}
        max={48}
      />
      <PixelInput
        label="Відступ між елементами"
        value={value.contentGap}
        onChange={contentGap => onChange({ contentGap })}
        max={32}
      />
    </div>
  );
}
