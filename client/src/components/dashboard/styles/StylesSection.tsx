"use client";

import { Button } from "@/components/ui/Button/Button";
import { ColorField } from "@/components/ui/ColorField/ColorField";
import { SectionCard } from "@/components/ui/SectionCard/SectionCard";
import { CARD_FONT_OPTIONS } from "@/constants/cardFonts";
import { ACCENT_COLOR_PRESETS } from "@/constants/colorPresets";
import { useUpdateStyles } from "@/hooks/dashboard/useUpdateStyles";
import { useUploadBackground } from "@/hooks/dashboard/useUploadBackground";
import { IBackground, IBackgroundType, IUserStyles } from "@/types/styles";
import { IUser } from "@/types/user";
import { getObjectDiff } from "@/utils/diff";
import { useState } from "react";
import { BackgroundControls } from "./controls/BackgroundControls";
import { StylePreview } from "./StylePreview";
import styles from "./StylesSection.module.scss";

interface PendingBackgroundImage {
  file: File;
  previewUrl: string;
}

export function StylesSection({ user }: { user: IUser }) {
  const [draft, setDraft] = useState<IUserStyles>(user.styles);
  const [pendingImage, setPendingImage] = useState<PendingBackgroundImage | null>(null);
  const updateStyles = useUpdateStyles();
  const uploadBackground = useUploadBackground();

  function updateFont(font: string) {
    setDraft(prev => ({ ...prev, font }));
  }

  function updateAccentColor(accentColor: string) {
    setDraft(prev => ({ ...prev, accentColor }));
  }

  function updateBackgroundType(type: IBackgroundType) {
    setDraft(prev => ({ ...prev, background: { ...prev.background, type } }));
  }

  function updateBackground(patch: Partial<IBackground>) {
    setDraft(prev => ({ ...prev, background: { ...prev.background, ...patch } }));
  }

  function handleSelectBackgroundImage(file: File) {
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);

    const previewUrl = URL.createObjectURL(file);
    setPendingImage({ file, previewUrl });
    setDraft(prev => ({ ...prev, background: { ...prev.background, type: "image" } }));
  }

  async function handleSave() {
    let stylesDraft = draft;

    if (pendingImage) {
      try {
        const { backgroundUrl } = await uploadBackground.mutateAsync(pendingImage.file);
        stylesDraft = {
          ...draft,
          background: { ...draft.background, image: backgroundUrl }
        };
        setDraft(stylesDraft);
        URL.revokeObjectURL(pendingImage.previewUrl);
        setPendingImage(null);
      } catch {
        return;
      }
    }

    const diff = getObjectDiff(
      user.styles as unknown as Record<string, unknown>,
      stylesDraft as unknown as Record<string, unknown>
    ) as Partial<IUserStyles>;

    updateStyles.mutate(diff);
  }

  function handleReset() {
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);
    setPendingImage(null);
    setDraft(user.styles);
  }

  const isDirty = pendingImage !== null || JSON.stringify(draft) !== JSON.stringify(user.styles);
  const isSaving = updateStyles.isPending || uploadBackground.isPending;

  return (
    <SectionCard title="Стилі картки" description="Налаштуйте вигляд вашої публічної картки.">
      <div className={styles.layout}>
        <StylePreview
          user={user}
          draftStyles={draft}
          previewImageOverride={pendingImage?.previewUrl}
        />

        <div className={styles.controls}>
          <div className={styles.selectField}>
            <span className={styles.label}>Шрифт</span>
            <select
              className={styles.select}
              value={draft.font}
              onChange={e => updateFont(e.target.value)}
            >
              {CARD_FONT_OPTIONS.map(option => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{ fontFamily: option.previewFamily }}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <ColorField
            label="Акцентний колір"
            value={draft.accentColor}
            onChange={updateAccentColor}
            presets={ACCENT_COLOR_PRESETS}
          />

          <BackgroundControls
            value={{
              ...draft.background,
              image: pendingImage?.previewUrl ?? draft.background.image
            }}
            accentColor={draft.accentColor}
            isUploading={uploadBackground.isPending}
            onTypeChange={updateBackgroundType}
            onChange={updateBackground}
            onSelectImage={handleSelectBackgroundImage}
          />

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={handleReset} disabled={!isDirty}>
              Скасувати
            </Button>
            <Button type="button" onClick={handleSave} disabled={!isDirty || isSaving}>
              {isSaving ? "Збереження..." : "Зберегти стилі"}
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
