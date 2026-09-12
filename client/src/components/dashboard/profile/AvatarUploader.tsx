"use client";

import { ChangeEvent, useRef } from "react";
import { useUploadAvatar } from "@/hooks/dashboard/useUploadAvatar";
import { Button } from "@/components/ui/Button/Button";
import styles from "./AvatarUploader.module.scss";

export function AvatarUploader({ avatarUrl, username }: { avatarUrl?: string; username: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
    event.target.value = "";
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.preview}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={username} className={styles.image} />
        ) : (
          <span className={styles.placeholder}>{username.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          disabled={uploadAvatar.isPending}
        >
          {uploadAvatar.isPending ? "Завантаження..." : "Змінити фото"}
        </Button>
      </div>
    </div>
  );
}
