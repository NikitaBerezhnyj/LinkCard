"use client";

import { AvatarPlaceholder } from "@/components/ui/AvatarPlaceholder/AvatarPlaceholder";
import { useUserSearch } from "@/hooks/landing/useUserSearch";
import { IUserSearchResult } from "@/types/user";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "sonner";
import styles from "./SearchSection.module.scss";

const SEARCH_DEBOUNCE_MS = 300;

export function SearchSection() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  const { results, isLoading, error, search } = useUserSearch();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(error.message);
  }, [error]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function handleFocus() {
    setIsFocused(true);

    if (!query.trim()) {
      void search("");
    }
  }

  function handleBlur() {
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  }

  function handleChange(value: string) {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value.trim()) {
      void search("");

      return;
    }

    debounceRef.current = setTimeout(() => {
      void search(value);
    }, SEARCH_DEBOUNCE_MS);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    await search(normalizedQuery);
  }

  function handleUserSelect(user: IUserSearchResult) {
    router.push(`/users/${user.username}`);
  }

  const showResults = isFocused && (results.length > 0 || isLoading);

  return (
    <section id="search" className={styles.section} aria-labelledby="search-title">
      <div className={styles.inner}>
        <h2 id="search-title" className={styles.title}>
          Знайди картку будь-якого користувача
        </h2>

        <p className={styles.subtitle}>
          Введи ім&apos;я користувача, щоб знайти його публічну картку на LinkCard.
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
              onChange={event => handleChange(event.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoComplete="off"
            />
          </div>

          {showResults && (
            <div className={styles.results}>
              {isLoading ? (
                <div className={styles.loading}>Пошук...</div>
              ) : (
                results.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    className={styles.result}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => handleUserSelect(user)}
                  >
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt="" className={styles.avatar} />
                    ) : (
                      <AvatarPlaceholder
                        username={user.username}
                        size={84}
                        className={styles.avatar}
                      />
                    )}

                    <span className={styles.username}>{user.username}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
