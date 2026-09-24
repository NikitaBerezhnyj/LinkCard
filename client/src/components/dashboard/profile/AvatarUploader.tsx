"use client";

import { AvatarPlaceholder } from "@/components/ui/AvatarPlaceholder/AvatarPlaceholder";
import { CropModal } from "@/components/ui/CropModal/CropModal";
import { useUploadAvatar } from "@/hooks/dashboard/useUploadAvatar";
import { ChangeEvent, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa6";
import styles from "./AvatarUploader.module.scss";

export function AvatarUploader({ avatarUrl, username }: { avatarUrl?: string; username: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setPendingImageSrc(URL.createObjectURL(file));
    event.target.value = "";
  }

  function handleCropConfirm(blob: Blob) {
    if (pendingImageSrc) URL.revokeObjectURL(pendingImageSrc);
    setPendingImageSrc(null);
    uploadAvatar.mutate(blob);
  }

  function handleCropCancel() {
    if (pendingImageSrc) URL.revokeObjectURL(pendingImageSrc);
    setPendingImageSrc(null);
  }

  const openPicker = () => inputRef.current?.click();

  const getUploadButtonText = () => {
    if (avatarUrl) {
      return "Змінити фото";
    }

    if (uploadAvatar.isPending) {
      return "Завантаження...";
    }

    return "Завантажити фото";
  };

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.preview}
        onClick={openPicker}
        disabled={uploadAvatar.isPending}
        tabIndex={-1}
        aria-hidden
      >
        <span className={styles.avatar}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={username} className={styles.image} />
          ) : (
            <AvatarPlaceholder username={username} size={88} />
          )}
        </span>
        <span className={styles.badge}>
          {uploadAvatar.isPending ? <span className={styles.spinner} /> : <FaCamera />}
        </span>
      </button>

      <div className={styles.info}>
        <p className={styles.name}>Фото профілю</p>
        <p className={styles.hint}>Оберіть зображення — перед збереженням його можна обрізати.</p>
        <button
          type="button"
          className={styles.changeButton}
          onClick={openPicker}
          disabled={uploadAvatar.isPending}
        >
          {getUploadButtonText()}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      {pendingImageSrc && (
        <CropModal
          imageSrc={pendingImageSrc}
          aspect={1}
          cropShape="round"
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
