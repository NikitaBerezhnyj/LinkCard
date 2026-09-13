import styles from "./HowItWorksSection.module.scss";

const steps = [
  {
    number: "01",
    title: "Створи акаунт",
    description: "Реєстрація займає хвилину — потрібні лише email та пароль."
  },
  {
    number: "02",
    title: "Налаштуй картку",
    description: "Додай посилання, аватар, біо та обери стиль, який пасує саме тобі."
  },
  {
    number: "03",
    title: "Поділись нею",
    description: "Розсилай персональне посилання або показуй QR-код прямо з картки."
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className={styles.section} aria-labelledby="how-title">
      <div className={styles.inner}>
        <span className={styles.eyebrow}>Як це працює</span>
        <h2 id="how-title" className={styles.title}>
          Від реєстрації до готової картки за три кроки
        </h2>
        <ol className={styles.steps}>
          {steps.map(step => (
            <li key={step.number} className={styles.step}>
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
