import { FaBolt, FaImage, FaLink, FaPalette, FaQrcode, FaUserPen } from "react-icons/fa6";
import styles from "./FeaturesSection.module.scss";

const features = [
  {
    Icon: FaLink,
    title: "Усі посилання в одному місці",
    description: "Додавай необмежену кількість посилань і керуй їх порядком."
  },
  {
    Icon: FaPalette,
    title: "Кастомний стиль картки",
    description: "Обирай кольори та вигляд картки під свій бренд чи настрій — без коду."
  },
  {
    Icon: FaQrcode,
    title: "QR-код для миттєвого шерингу",
    description: "Переверни картку — і покажи QR-код, який веде прямо на твій профіль."
  },
  {
    Icon: FaUserPen,
    title: "Профіль з характером",
    description: "Аватар, ім'я користувача та коротке біо з першого погляду."
  },
  {
    Icon: FaImage,
    title: "Власний фон",
    description: "Завантаж власне зображення чи текстуру для фону картки."
  },
  {
    Icon: FaBolt,
    title: "Швидко й просто",
    description: "Створення й редагування картки займає кілька хвилин."
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className={styles.section} aria-labelledby="features-title">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Можливості</span>
        <h2 id="features-title" className={styles.title}>
          Все, що потрібно для персональної картки
        </h2>
        <div className={styles.grid}>
          {features.map(({ Icon, title, description }) => (
            <article key={title} className={styles.card}>
              <Icon className={styles.icon} aria-hidden="true" />
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
