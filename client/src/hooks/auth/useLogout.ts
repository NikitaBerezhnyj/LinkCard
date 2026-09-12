import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logoutRequest } from "@/services/authServices";
import { useAuthStore } from "@/stores/authStore";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore(state => state.clearAuth);

  return useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      router.push("/login");
    }
  });
}
