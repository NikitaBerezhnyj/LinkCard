import { AuthCta } from "../AuthCta/AuthCta";
import styles from "./HeroSection.module.scss";

export function HeroSection() {
  return (
    <section className={styles.section} aria-labelledby="hero-title">
      <div className={styles.inner}>
        <span className={styles.eyebrowLine} aria-hidden="true" />
        <h1 id="hero-title" className={styles.title}>
          Одна картка. Усі твої посилання. Один QR-код.
        </h1>
        <p className={styles.subtitle}>
          LinkCard збирає соцмережі, сайти та контакти в одну персональну сторінку, яку легко
          кастомізувати під себе й миттю показати через QR-код.
        </p>
        <AuthCta variant="hero" />
      </div>
      <a href="#search" className={styles.scrollHint} aria-label="Гортати далі">
        <span className={styles.scrollHintLine} />
        Гортай далі
      </a>
    </section>
  );
}
