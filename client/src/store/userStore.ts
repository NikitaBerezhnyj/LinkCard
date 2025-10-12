// store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  username: string | null;
  isAuth: boolean;
  lastChecked: number;
  setUser: (username: string) => void;
  logout: () => void;
  updateLastChecked: () => void;
}

export const useUserStore = create(
  persist<UserState>(
    set => ({
      username: null,
      isAuth: false,
      lastChecked: 0,
      setUser: username =>
        set({
          username,
          isAuth: true,
          lastChecked: Date.now()
        }),
      logout: () =>
        set({
          username: null,
          isAuth: false,
          lastChecked: 0
        }),
      updateLastChecked: () => set({ lastChecked: Date.now() })
    }),
    {
      name: "user-storage"
    }
  )
);
