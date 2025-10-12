"use client";

import styles from "@/styles/pages/Error.module.scss";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { TbError404 } from "react-icons/tb";

export default function NotFoundPage() {
  const { isAuth } = useAuth();

  return (
    <>
      <Header isAuth={isAuth} />
      <main className={styles.errorWrapper}>
        <div className={styles.content}>
          <TbError404 className={styles.icon} />
          <h1>Сторінка не знайдена</h1>
          <p>Вибачте, але такої сторінки тут немає.</p>
          <div className={styles.buttons}>
            <Link href="/">
              <Button className="primary">Повернутися на головну</Button>
            </Link>
            {!isAuth && (
              <Link href="/register">
                <Button className="secondary">Створити акаунт</Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
