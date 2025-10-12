"use client";

import { useEffect } from "react";
import styles from "@/styles/pages/Error.module.scss";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleGoToHome = () => {
    router.push("/");
  };

  return (
    <>
      <Header isAuth={isAuth} />
      <main className={styles.errorWrapper}>
        <div className={styles.content}>
          <FaRegSadTear className={styles.icon} />
          <h1>Щось пішло не так</h1>
          <p>Виникла помилка на сервері або в додатку. Спробуйте ще раз.</p>
          <div className={styles.buttons}>
            <Button onClick={reset}>Спробувати знову</Button>
            <Button onClick={handleGoToHome}>Повернутися на головну</Button>
            {/* <Link href="/">
              <Button className="primary">Повернутися на головну</Button>
            </Link> */}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
