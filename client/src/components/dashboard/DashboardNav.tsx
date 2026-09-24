"use client";

import { Logo } from "@/components/ui/Logo/Logo";
import { useLogout } from "@/hooks/auth/useLogout";
import Link from "next/link";
import { FaArrowRightFromBracket, FaArrowUpRightFromSquare } from "react-icons/fa6";
import styles from "./DashboardNav.module.scss";

export function DashboardNav({ username }: { username: string }) {
  const logout = useLogout();

  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Logo />
        <div className={styles.actions}>
          <Link href={`/users/${username}`} target="_blank" className={styles.viewLink}>
            Переглянути картку <FaArrowUpRightFromSquare />
          </Link>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            aria-label="Вийти"
          >
            <FaArrowRightFromBracket />
          </button>
        </div>
      </div>
    </header>
  );
}
