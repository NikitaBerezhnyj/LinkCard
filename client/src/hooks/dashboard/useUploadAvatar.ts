import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadAvatar } from "@/services/userServices";
import { IUser } from "@/types/user";

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
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
