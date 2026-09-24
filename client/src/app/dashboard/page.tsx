"use client";

import { LinksSection } from "@/components/dashboard/links/LinksSection";
import { ProfileSection } from "@/components/dashboard/profile/ProfileSection";
import { StylesSection } from "@/components/dashboard/styles/StylesSection";
import { useCurrentUser } from "@/hooks/dashboard/useCurrentUser";
import styles from "./dashboard-page.module.scss";

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return null;
  }

  return (
    <>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Панель керування</p>
        <h1 className={styles.title}>Ваша картка</h1>
        <p className={styles.subtitle}>
          Профіль, посилання та вигляд — усе, що бачать відвідувачі.
        </p>
      </div>

      <div className={styles.sections}>
        <ProfileSection user={user} />
        <LinksSection user={user} />
        <StylesSection user={user} />
      </div>
    </>
  );
}
