import { authService } from "@/services/AuthService";
import { userService } from "@/services/UserService";
import { IUser } from "@/types/IUser";
import { useUserStore } from "@/store/userStore";

const AUTH_CHECK_INTERVAL = 5 * 60 * 1000;

export const accessManager = {
  async getCurrentUserCached(forceRefresh = false): Promise<string | null> {
    const store = useUserStore.getState();
    const now = Date.now();
    const timeSinceLastCheck = now - store.lastChecked;

    if (
      !forceRefresh &&
      store.username &&
      store.isAuth &&
      timeSinceLastCheck < AUTH_CHECK_INTERVAL
    ) {
      console.log("Using cached username:", store.username);
      return store.username;
    }

    console.log("Fetching fresh user data");
    try {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser?.username) {
        await authService.logout();
        store.logout();
        return null;
      }

      if (currentUser.username !== store.username) {
        store.setUser(currentUser.username);
      } else {
        store.updateLastChecked();
      }

      return currentUser.username;
    } catch (error) {
      console.error("Failed to get current user:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 403 || axiosError.response?.status === 401) {
          await authService.logout();
          store.logout();
        }
      }

      return null;
    }
  },

  async checkEditPageAccess(
    usernameParam: string,
    options: { forceRefresh?: boolean } = {}
  ): Promise<{
    currentUser: string;
    pageUser: IUser;
  } | null> {
    try {
      const currentUsername = await this.getCurrentUserCached(options.forceRefresh);

      if (!currentUsername) {
        return null;
      }

      if (currentUsername !== usernameParam) {
        return null;
      }

      const response = await userService.getUser(usernameParam);
      const pageUser = response?.data?.data as IUser | undefined;

      if (!pageUser) {
        return null;
      }

      return {
        currentUser: currentUsername,
        pageUser
      };
    } catch (error) {
      console.error("Page access check failed:", error);
      return null;
    }
  }
};
