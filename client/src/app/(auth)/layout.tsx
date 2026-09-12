import { Logo } from "@/components/ui/Logo/Logo";
import styles from "./auth-layout.module.scss";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
