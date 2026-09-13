"use client";

import { Button } from "@/components/ui/Button/Button";
import { useCurrentUser } from "@/hooks/dashboard/useCurrentUser";
import Link from "next/link";
import styles from "./AuthCta.module.scss";

interface AuthCtaProps {
  variant?: "header" | "hero" | "final";
}

const BUTTON_VARIANTS = {
  header: { primary: "primary", secondary: "ghost" },
  hero: { primary: "primary", secondary: "ghost" },
  final: { primary: "invertedPrimary", secondary: "invertedGhost" }
} as const;

export function AuthCta({ variant = "hero" }: AuthCtaProps) {
  const { data: user, isLoading } = useCurrentUser();
  const isAuthenticated = !isLoading && !!user;
  const buttons = BUTTON_VARIANTS[variant];

  if (isAuthenticated) {
    return (
      <div className={`${styles.wrapper} ${styles[variant]}`}>
        <Link href="/dashboard">
          <Button variant={buttons.primary}>Перейти в Dashboard</Button>
        </Link>
        <Link href={`/user/${user.username}`}>
          <Button variant={buttons.secondary}>Моя картка</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${styles[variant]}`}>
      <Link href="/register">
        <Button variant={buttons.primary}>Створити картку</Button>
      </Link>
      <Link href="/login">
        <Button variant={buttons.secondary}>Увійти</Button>
      </Link>
    </div>
  );
}
