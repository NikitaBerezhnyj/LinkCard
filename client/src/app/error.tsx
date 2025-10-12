"use client";

import { useEffect } from "react";
import styles from "@/styles/pages/Error.module.scss";
import Button from "@/components/ui/Button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { FaRegSadTear } from "react-icons/fa";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const { isAuth } = useAuth();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header isAuth={isAuth} />
      <main className={styles.errorWrapper}>
        <div className={styles.content}>
          <FaRegSadTear className={styles.icon} />
          <h1>Щось пішло не так</h1>
          <p>Виникла помилка: {error.message}</p>
          <div className={styles.buttons}>
            <Button onClick={reset}>Спробувати знову</Button>
            <Button onClick={() => (window.location.href = "/")}>Повернутися на головну</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
