"use client";

import { Button } from "@/components/ui/Button/Button";
import { FormEvent, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "sonner";
import styles from "./SearchSection.module.scss";

export function SearchSection() {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    toast.info("Пошук користувачів скоро запрацює — слідкуй за оновленнями!");
  }

  return (
    <section id="search" className={styles.section} aria-labelledby="search-title">
      <div className={styles.inner}>
        <span className={styles.badge}>Незабаром</span>
        <h2 id="search-title" className={styles.title}>
          Знайди картку будь-якого користувача
        </h2>
        <p className={styles.subtitle}>
          Введи ім&apos;я користувача — і незабаром зможеш переглядати публічні картки інших людей
          на LinkCard.
        </p>
        <form className={styles.form} onSubmit={handleSubmit} role="search">
          <label htmlFor="user-search" className={styles.srOnly}>
            Пошук користувача
          </label>
          <div className={styles.inputWrapper}>
            <FiSearch className={styles.icon} aria-hidden="true" />
            <input
              id="user-search"
              type="search"
              name="q"
              placeholder="Наприклад, TestUser123"
              className={styles.input}
              value={query}
              onChange={event => setQuery(event.target.value)}
              autoComplete="off"
            />
          </div>
          <Button type="submit" variant="primary">
            Знайти
          </Button>
        </form>
      </div>
    </section>
  );
}
