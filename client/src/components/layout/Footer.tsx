import Link from "next/link";
import styles from "@/styles/components/Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.links}>
          <Link href="/terms">Умови користування</Link>
          <Link href="/privacy">Політика конфіденційності</Link>
        </div>
        <p>© {new Date().getFullYear()} LinkCard. Усі права захищено.</p>
      </div>
    </footer>
  );
}
