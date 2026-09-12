import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginRequest } from "@/services/authServices";
import { useAuthStore } from "@/stores/authStore";
import { LoginFormValues } from "@/schemas/loginSchema";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore(state => state.setAccessToken);

  return useMutation({
    mutationFn: (payload: LoginFormValues) => loginRequest(payload),
    onSuccess: data => {
      setAccessToken(data.accessToken);
      if (data.user) {
        queryClient.setQueryData(["currentUser"], data.user);
      }
      router.push("/dashboard");
    }
  });
}
