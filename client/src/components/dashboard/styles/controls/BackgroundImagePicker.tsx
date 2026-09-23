"use client";

import { ChangeEvent, useRef } from "react";
import { FaImage } from "react-icons/fa6";
import styles from "./BackgroundImagePicker.module.scss";

interface BackgroundImagePickerProps {
  imageUrl?: string;
  isUploading: boolean;
  onSelect: (file: File) => void;
}

export function BackgroundImagePicker({
  imageUrl,
  isUploading,
  onSelect
}: BackgroundImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onSelect(file);
    event.target.value = "";
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={`${styles.preview} ${!imageUrl ? styles.empty : ""}`}
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        aria-label="Обрати зображення для фону"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Фон картки" className={styles.image} />
        ) : (
          <span className={styles.placeholder}>
            <FaImage />
            <span className={styles.placeholderText}>Оберіть зображення</span>
          </span>
        )}

        {imageUrl && (
          <span className={styles.overlay}>
            {isUploading ? "Завантаження..." : "Змінити зображення"}
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />
    </div>
  );
}
