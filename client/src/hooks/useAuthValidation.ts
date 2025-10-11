import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { authService } from "@/services/AuthService";

export function useAuthValidation() {
  const { setUser, logout } = useUserStore();

  useEffect(() => {
    const validate = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser?.username) {
          setUser(currentUser.username);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    };

    validate();
  }, [setUser, logout]);
}
