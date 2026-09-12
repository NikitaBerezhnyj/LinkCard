import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IUser } from "@/types/user";
import { updateCurrentUser, UpdateUserPayload } from "@/services/userServices";

type UpdateStylesPayload = NonNullable<UpdateUserPayload["styles"]>;

export function useUpdateStyles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (styles: UpdateStylesPayload) => updateCurrentUser({ styles }),

    onSuccess: user => {
      queryClient.setQueryData<IUser>(["currentUser"], user);
      toast.success("Стилі картки оновлено");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Не вдалося оновити стилі");
    }
  });
}
