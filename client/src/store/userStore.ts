import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  username: string | null;
  isAuth: boolean;
  setUser: (username: string) => void;
  logout: () => void;
}

export const useUserStore = create(
  persist<UserState>(
    set => ({
      username: null,
      isAuth: false,
      setUser: username => set({ username, isAuth: true }),
      logout: () => set({ username: null, isAuth: false })
    }),
    {
      name: "user-storage"
    }
  )
);
