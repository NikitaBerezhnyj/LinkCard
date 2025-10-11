"use client";

import Link from "next/link";
import styles from "@/styles/components/Header.module.scss";
import { useUserStore } from "@/store/userStore";

export default function Header() {
  const { username, isAuth } = useUserStore();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          LinkCard
        </Link>

        <nav className={styles.nav}>
          {!isAuth ? (
            <button
              className={styles.loginButton}
              onClick={() => (window.location.href = "/login")}
            >
              Увійти
            </button>
          ) : (
            <button
              className={styles.profileButton}
              onClick={() => (window.location.href = `/user/${username}`)}
            >
              Профіль
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
