import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { authService } from "@/services/AuthService";

const AUTH_CHECK_INTERVAL = 5 * 60 * 1000;

export function useAuth(options: { forceCheck?: boolean } = {}) {
  const { setUser, logout, username, isAuth, lastChecked, updateLastChecked } = useUserStore();
  const hasCheckedRef = useRef(false);
  const { forceCheck = false } = options;

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastChecked;

    if (hasCheckedRef.current && !forceCheck && timeSinceLastCheck < AUTH_CHECK_INTERVAL) {
      return;
    }

    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();

        if (currentUser?.username) {
          if (currentUser.username !== username) {
            setUser(currentUser.username);
          } else {
            updateLastChecked();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("Помилка перевірки авторизації:", error);

        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status: number } };
          if (axiosError.response?.status === 403) {
            logout();
          }
        }
      }
    };

    checkAuth();
    hasCheckedRef.current = true;
  }, [setUser, logout, username, lastChecked, updateLastChecked, forceCheck]);

  return { username, isAuth };
}
