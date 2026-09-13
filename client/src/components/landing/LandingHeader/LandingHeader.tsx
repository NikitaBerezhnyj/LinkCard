import { Logo } from "@/components/ui/Logo/Logo";
import { AuthCta } from "../AuthCta/AuthCta";
import styles from "./LandingHeader.module.scss";

export function LandingHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Logo />
        <AuthCta variant="header" />
      </div>
    </header>
  );
}
