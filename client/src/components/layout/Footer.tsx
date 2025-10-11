import Link from "next/link";
import styles from "@/styles/components/Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© {new Date().getFullYear()} LinkCard. Усі права захищено.</p>
        <div className={styles.links}>
          <Link href="/privacy">Політика конфіденційності</Link>
          <Link href="/terms">Умови користування</Link>
        </div>
      </div>
    </footer>
  );
}
