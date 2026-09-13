import { updateCurrentUser } from "@/services/userServices";
import { IUpdateUserPayload, IUser } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateLinksPayload = NonNullable<IUpdateUserPayload["links"]>;

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
