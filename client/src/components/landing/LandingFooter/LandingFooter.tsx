import { Logo } from "@/components/ui/Logo/Logo";
import Link from "next/link";
import styles from "./LandingFooter.module.scss";

export function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo />
          <p className={styles.tagline}>Одна картка для всіх твоїх посилань.</p>
        </div>
        <nav className={styles.links} aria-label="Юридична інформація">
          <Link href="/privacy">Політика конфіденційності</Link>
        </nav>
      </div>
      <div className={styles.divider} />
      <p className={styles.copyright}>© {new Date().getFullYear()} LinkCard. Усі права захищені.</p>
    </footer>
  );
}
