import { updateCurrentUser } from "@/services/userServices";
import { IUpdateUserPayload, IUser } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateStylesPayload = NonNullable<IUpdateUserPayload["styles"]>;

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
