"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/pages/Home.module.scss";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { IoIosShareAlt } from "react-icons/io";
import { MdSecurity, MdDesignServices } from "react-icons/md";
import { authService } from "@/services/AuthService";

interface User {
  username: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Не вдалося отримати користувача:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Header />
      <main className={styles.homeWrapper}>
        {/* Hero Section */}
        <section className={`${styles.section} ${styles.hero}`}>
          <div className={styles.content}>
            <h1>
              {user ? (
                <>
                  Вітаємо, <span>{user.username}</span> 👋
                </>
              ) : (
                <>
                  Створи свою персональну картку з <span>LinkCard</span>
                </>
              )}
            </h1>

            <p>
              {user
                ? "Повернись до свого профілю або створи новий стиль своєї сторінки."
                : "Керуйте своїм профілем, додавайте посилання, змінюйте стиль і діліться ним з друзями — все просто і красиво."}
            </p>

            {!loading && (
              <div className={styles.buttons}>
                {user ? (
                  <>
                    <Link href={`/user/${user.username}`}>
                      <Button>Перейти до профілю</Button>
                    </Link>
                    <Link href={`/user/${user.username}/edit`}>
                      <Button variant="primary">Редагувати сторінку</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/register">
                      <Button>Почати зараз</Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="primary">Увійти</Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className={`${styles.section} ${styles.features}`}>
          <h2>Що ми пропонуємо</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <MdDesignServices size={60} />
              <h3>Повна кастомізація</h3>
              <p>Змінюй кольори, фон, шрифти та оформлення під свій стиль.</p>
            </div>

            <div className={styles.featureCard}>
              <IoIosShareAlt size={60} />
              <h3>Поділися з усіма</h3>
              <p>Додай свої соціальні посилання, контакти й розкажи про себе світу.</p>
            </div>

            <div className={styles.featureCard}>
              <MdSecurity size={60} />
              <h3>Безпечний облік</h3>
              <p>Ми дбаємо про твою приватність та захищеність акаунту.</p>
            </div>
          </div>
        </section>

        {/* Call To Action */}
        {!user && (
          <section className={`${styles.section} ${styles.cta}`}>
            <div className={styles.ctaContent}>
              <h2>Готові створити власну сторінку?</h2>
              <p>Приєднуйтесь до спільноти користувачів, які вже мають свою унікальну візитку.</p>
              <Link href="/register">
                <Button>Створити акаунт</Button>
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
