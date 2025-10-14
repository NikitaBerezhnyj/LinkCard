"use client";

import React from "react";
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

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>{title || t("confirm-modal.confirmTitle")}</h2>
        <p className={styles.text}>{message || t("confirm-modal.confirmMessage")}</p>

        <div className={styles.buttons}>
          <button
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
