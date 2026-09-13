import { updateCurrentUser } from "@/services/userServices";
import { IUpdateUserPayload, IUser } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateProfilePayload = Pick<IUpdateUserPayload, "username" | "email" | "bio">;

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateCurrentUser(payload),

    onSuccess: user => {
      queryClient.setQueryData<IUser>(["currentUser"], user);
      toast.success("Профіль оновлено");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Не вдалося оновити профіль");
    }
  });
}
