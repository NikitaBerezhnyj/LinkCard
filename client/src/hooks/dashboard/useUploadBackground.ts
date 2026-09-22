import { uploadBackgroundImage } from "@/services/userServices";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUploadBackground() {
  return useMutation({
    mutationFn: (file: File) => uploadBackgroundImage(file),
    onError: (error: Error) => {
      toast.error(error.message || "Не вдалося завантажити зображення");
    }
  });
}
