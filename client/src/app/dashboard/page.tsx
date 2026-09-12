"use client";

import { useCurrentUser } from "@/hooks/dashboard/useCurrentUser";
import { ProfileSection } from "@/components/dashboard/profile/ProfileSection";
import { LinksSection } from "@/components/dashboard/links/LinksSection";
import { StylesSection } from "@/components/dashboard/styles/StylesSection";
import styles from "./dashboard-page.module.scss";

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className={styles.sections}>
      <ProfileSection user={user} />
      <LinksSection user={user} />
      <StylesSection user={user} />
    </div>
  );
}
