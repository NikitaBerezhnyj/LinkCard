import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/services/authServices";
import { useAuthStore } from "@/stores/authStore";
import { RegisterFormValues } from "@/schemas/registerSchema";

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore(state => state.setAccessToken);

  return useMutation({
    mutationFn: (payload: RegisterFormValues) => registerRequest(payload),
    onSuccess: data => {
      setAccessToken(data.accessToken);
      if (data.user) {
        queryClient.setQueryData(["currentUser"], data.user);
      }
      router.push("/dashboard");
    }
  });
}
