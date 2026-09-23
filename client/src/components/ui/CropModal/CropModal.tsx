"use client";

import { Button } from "@/components/ui/Button/Button";
import { getCroppedImageBlob } from "@/utils/cropImage";
import { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import styles from "./CropModal.module.scss";

interface CropModalProps {
  imageSrc: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

export function CropModal({
  imageSrc,
  aspect = 1,
  cropShape = "round",
  onConfirm,
  onCancel
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.cropArea}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === "rect"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className={styles.controls}>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className={styles.zoomSlider}
            aria-label="Масштаб"
          />

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isProcessing}>
              Скасувати
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing || !croppedAreaPixels}
            >
              {isProcessing ? "Обробка..." : "Застосувати"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
