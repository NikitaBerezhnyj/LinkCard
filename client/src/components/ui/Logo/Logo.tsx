import Link from "next/link";
import styles from "./Logo.module.scss";

export function Logo() {
  return (
    <Link href="/" className={styles.logo}>
      Link<span className={styles.accent}>Card</span>
    </Link>
  );
}
