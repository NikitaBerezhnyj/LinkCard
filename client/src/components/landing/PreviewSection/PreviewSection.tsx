import { PublicCard } from "@/components/card/PublicCard/PublicCard";
import { IUserStyles } from "@/types/styles";
import { IUser } from "@/types/user";
import styles from "./PreviewSection.module.scss";

const demoStyles: IUserStyles = {
  font: "var(--font-manrope)",
  accentColor: "#2c5f4a",
  background: {
    type: "color",
    color: "#f6f1e6"
  }
};

const demoUser: IUser = {
  id: "demo",
  avatar: "public/images/avatar.jpg",
  username: "TestUser123",
  email: "demo@linkcard.app",
  bio: "Розробник • Ділюсь проєктами та посиланнями",
  createdAt: new Date().toISOString(),
  links: [
    { id: "1", title: "Портфоліо", url: "https://example.com", order: 0 },
    { id: "2", title: "GitHub", url: "https://github.com", order: 1 },
    { id: "3", title: "Telegram", url: "https://t.me", order: 2 }
  ],
  styles: demoStyles
};

export function PreviewSection() {
  return (
    <section className={styles.section} aria-labelledby="preview-title">
      <div className={styles.inner}>
        <div className={styles.text}>
          <span className={styles.eyebrow}>Живий приклад</span>
          <h2 id="preview-title" className={styles.title}>
            Ось як виглядає готова картка
          </h2>
          <p className={styles.subtitle}>
            Натисни на іконку QR, щоб побачити, як картка перевертається — саме так її бачитимуть
            твої підписники.
          </p>
        </div>
        <div className={styles.cardWrapper}>
          <PublicCard
            user={demoUser}
            cardUrl="https://linkcard.app/users/TestUser123"
            className={styles.previewCard}
          />
        </div>
      </div>
    </section>
  );
}
