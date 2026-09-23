import { uploadAvatar } from "@/services/userServices";
import { IUser } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File | Blob) => uploadAvatar(file),
    onSuccess: ({ avatarUrl }) => {
      queryClient.setQueryData<IUser | undefined>(["currentUser"], current =>
        current ? { ...current, avatar: avatarUrl } : current
      );
      toast.success("Аватар оновлено");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Не вдалося завантажити аватар");
    }
  });
}
