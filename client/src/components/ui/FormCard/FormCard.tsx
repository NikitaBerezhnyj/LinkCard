import { ReactNode } from "react";
import styles from "./FormCard.module.scss";

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function FormCard({ title, subtitle, children, footer }: FormCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.stub} aria-hidden="true" />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
