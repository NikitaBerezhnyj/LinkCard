import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadBackgroundImage } from "@/services/userServices";

export function useUploadBackground() {
  return useMutation({
    mutationFn: (file: File) => uploadBackgroundImage(file),
    onError: (error: Error) => {
      toast.error(error.message || "Не вдалося завантажити зображення");
    }
  });
}
