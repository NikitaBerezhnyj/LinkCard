"use client";

import Link from "next/link";
import styles from "@/styles/components/Header.module.scss";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

interface HeaderProps {
  isAuth: boolean;
}

export default function Header({ isAuth }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: "/", label: "Головна" },
    { href: "/about", label: "Про нас" },
    { href: "/docs", label: "Документація" }
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          LinkCard
        </Link>

        <nav className={`${styles.nav} ${isOpen ? styles.open : ""}`}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.active : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {!isAuth ? (
            <Link href="/login" className={styles.loginButton} onClick={() => setIsOpen(false)}>
              Увійти
            </Link>
          ) : (
            <></>
          )}
        </nav>

        <button className={styles.burger} onClick={toggleMenu}>
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
    </header>
  );
}
