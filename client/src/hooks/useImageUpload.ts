import { toast } from "react-hot-toast";
import axios from "axios";
import { uploadService } from "@/services/UploadService";
import { useTranslation } from "react-i18next";

interface UploadOptions {
  type: "avatar" | "background";
  maxSizeMB: number;
  onSuccess: (url: string) => void;
  onStart?: () => void;
  onFinish?: () => void;
}

export function useImageUpload() {
  const { t } = useTranslation();

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    options: UploadOptions
  ) => {
    const { type, maxSizeMB, onSuccess, onStart, onFinish } = options;
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(t("edit.upload.fileTooLarge", { maxSizeMB }));
      return;
    }

    try {
      onStart?.();
      const response =
        type === "avatar"
          ? await uploadService.uploadAvatar(file)
          : await uploadService.uploadBackground(file);
      const newUrl = response.data?.filePath;
      if (!newUrl) throw new Error(t("edit.upload.uploadFailed"));
      onSuccess(newUrl);
      toast.success(
        type === "avatar" ? t("edit.upload.avatarSuccess") : t("edit.upload.backgroundSuccess")
      );
    } catch (error: unknown) {
      console.error(`Upload error (${type}):`, error);
      let msg = t("edit.upload.uploadFailed");
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast.error(msg);
    } finally {
      onFinish?.();
    }
  };

  return { handleImageUpload };
}
