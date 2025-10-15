"use client";

import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "@/styles/components/Modal.module.scss";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  danger = true
}) => {
  const { t } = useTranslation();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <h2 id="modal-title" className={styles.title}>
          {title || t("confirm-modal.confirmTitle")}
        </h2>
        <p id="modal-description" className={styles.text}>
          {message || t("confirm-modal.confirmMessage")}
        </p>

        <div className={styles.buttons}>
          <button
            ref={confirmButtonRef}
            className={danger ? styles.confirmButton : styles.cancelButton}
            onClick={onConfirm}
          >
            {confirmText || t("confirm-modal.confirmButton")}
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            {cancelText || t("confirm-modal.cancelButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
