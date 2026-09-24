import { ReactNode } from "react";
import styles from "./SectionCard.module.scss";

interface SectionCardProps {
  title: string;
  description?: string;
  hint?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, description, hint, footer, children }: SectionCardProps) {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </header>

      <div className={styles.body}>{children}</div>

      {footer && (
        <footer className={styles.footer}>
          {hint && <span className={styles.hint}>{hint}</span>}
          <div className={styles.actions}>{footer}</div>
        </footer>
      )}
    </section>
  );
}
