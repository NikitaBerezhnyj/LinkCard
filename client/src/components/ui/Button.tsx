"use client";

import styles from "@/styles/components/Button.module.scss";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
