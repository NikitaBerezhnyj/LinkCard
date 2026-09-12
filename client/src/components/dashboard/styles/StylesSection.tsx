"use client";

import { Button } from "@/components/ui/Button/Button";
import { SectionCard } from "@/components/ui/SectionCard/SectionCard";
import { ToggleGroup } from "@/components/ui/ToggleGroup/ToggleGroup";
import {
  IBackground,
  IBackgroundType,
  IButtonColors,
  IColorScheme,
  ILayout,
  ITypography,
  IUserStyles
} from "@/types/styles";
import { IUser } from "@/types/user";
import { getObjectDiff } from "@/utils/diff";
import { useState } from "react";
import { useUpdateStyles } from "../../../hooks/dashboard/useUpdateStyles";
import { BackgroundControls } from "./controls/BackgroundControls";
import { ColorControls } from "./controls/ColorControls";
import { LayoutControls } from "./controls/LayoutControls";
import { TypographyControls } from "./controls/TypographyControls";
import { StylePreview } from "./StylePreview";
import styles from "./StylesSection.module.scss";

type Tab = "typography" | "colors" | "layout" | "background";

const TABS: { value: Tab; label: string }[] = [
  { value: "typography", label: "Текст" },
  { value: "colors", label: "Кольори" },
  { value: "layout", label: "Розміри" },
  { value: "background", label: "Фон" }
];

export function StylesSection({ user }: { user: IUser }) {
  const [draft, setDraft] = useState<IUserStyles>(user.styles);
  const [tab, setTab] = useState<Tab>("typography");
  const updateStyles = useUpdateStyles();

  function updateTypography(patch: Partial<ITypography>) {
    setDraft(prev => ({ ...prev, typography: { ...prev.typography, ...patch } }));
  }

  function updateColors(patch: Partial<IColorScheme>) {
    setDraft(prev => ({ ...prev, colors: { ...prev.colors, ...patch } }));
  }

  function updateButtonColors(patch: Partial<IButtonColors>) {
    setDraft(prev => ({
      ...prev,
      colors: { ...prev.colors, button: { ...prev.colors.button, ...patch } }
    }));
  }

  function updateLayout(patch: Partial<ILayout>) {
    setDraft(prev => ({ ...prev, layout: { ...prev.layout, ...patch } }));
  }

  function updateBackgroundType(type: IBackgroundType) {
    setDraft(prev => ({ ...prev, background: { ...prev.background, type } }));
  }

  function updateBackground(patch: Partial<IBackground>) {
    setDraft(prev => ({
      ...prev,
      background: { ...prev.background, ...patch }
    }));
  }

  function handleSave() {
    const diff = getObjectDiff(
      user.styles as unknown as Record<string, unknown>,
      draft as unknown as Record<string, unknown>
    ) as Partial<IUserStyles>;

    updateStyles.mutate(diff);
  }

  function handleReset() {
    setDraft(user.styles);
  }

  const isDirty = JSON.stringify(draft) !== JSON.stringify(user.styles);

  return (
    <SectionCard title="Стилі картки" description="Налаштуйте вигляд вашої публічної картки.">
      <div className={styles.layout}>
        <StylePreview user={user} draftStyles={draft} />

        <div className={styles.controls}>
          <ToggleGroup options={TABS} value={tab} onChange={setTab} />

          <div className={styles.panel}>
            {tab === "typography" && (
              <TypographyControls value={draft.typography} onChange={updateTypography} />
            )}
            {tab === "colors" && (
              <ColorControls
                value={draft.colors}
                onChange={updateColors}
                onButtonChange={updateButtonColors}
              />
            )}
            {tab === "layout" && <LayoutControls value={draft.layout} onChange={updateLayout} />}
            {tab === "background" && (
              <BackgroundControls
                value={draft.background}
                onTypeChange={updateBackgroundType}
                onChange={updateBackground}
              />
            )}
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={handleReset} disabled={!isDirty}>
              Скасувати
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || updateStyles.isPending}
            >
              {updateStyles.isPending ? "Збереження..." : "Зберегти стилі"}
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
