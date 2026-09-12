import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCurrentUser, UpdateUserPayload } from "@/services/userServices";
import { IUser } from "@/types/user";

type UpdateLinksPayload = NonNullable<UpdateUserPayload["links"]>;

export function useUpdateLinks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (links: UpdateLinksPayload) => updateCurrentUser({ links }),

    onSuccess: user => {
      queryClient.setQueryData<IUser>(["currentUser"], user);
      toast.success("Посилання збережено");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Не вдалося зберегти посилання");
    }
  });
}
