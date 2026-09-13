import { AuthCta } from "../AuthCta/AuthCta";
import styles from "./FinalCtaSection.module.scss";

export function FinalCtaSection() {
  return (
    <section className={styles.section} aria-labelledby="final-cta-title">
      <div className={styles.inner}>
        <h2 id="final-cta-title" className={styles.title}>
          Готовий зібрати свою картку?
        </h2>
        <p className={styles.subtitle}>Це безкоштовно і займає кілька хвилин.</p>
        <AuthCta variant="final" />
      </div>
    </section>
  );
}
