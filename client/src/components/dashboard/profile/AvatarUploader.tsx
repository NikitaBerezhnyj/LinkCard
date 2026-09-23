"use client";

import { CropModal } from "@/components/ui/CropModal/CropModal";
import { useUploadAvatar } from "@/hooks/dashboard/useUploadAvatar";
import { ChangeEvent, useRef, useState } from "react";
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

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.preview}
        onClick={() => inputRef.current?.click()}
        disabled={uploadAvatar.isPending}
        aria-label="Змінити фото профілю"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={username} className={styles.image} />
        ) : (
          <span className={styles.placeholder}>{username.slice(0, 2).toUpperCase()}</span>
        )}

        <span className={styles.overlay}>
          {uploadAvatar.isPending ? "Завантаження..." : "Змінити фото"}
        </span>
      </button>

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
