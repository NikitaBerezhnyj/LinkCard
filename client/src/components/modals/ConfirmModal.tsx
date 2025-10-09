"use client";

import React from "react";
import styles from "@/styles/components/Modal.module.scss";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean; // якщо дія небезпечна (червона кнопка)
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = "Ви впевнені?",
  message = "Цю дію не можна буде скасувати.",
  confirmText = "Так",
  cancelText = "Ні",
  onConfirm,
  onCancel,
  danger = true
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.text}>{message}</p>

        <div className={styles.buttons}>
          <button
            className={danger ? styles.confirmButton : styles.cancelButton}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
