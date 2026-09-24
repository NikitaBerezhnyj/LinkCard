"use client";

import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { useCurrentUser } from "@/hooks/dashboard/useCurrentUser";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./dashboard-layout.module.scss";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const clearAuth = useAuthStore(state => state.clearAuth);
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    if (isError) {
      clearAuth();
      router.replace("/login");
    }
  }, [isError, clearAuth, router]);

  if (isLoading) {
    return (
      <div className={styles.loading} role="status">
        <span className={styles.spinner} aria-hidden />
        Завантаження...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <DashboardNav username={user.username} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
