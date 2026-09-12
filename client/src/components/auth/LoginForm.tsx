"use client";

import { Button } from "@/components/ui/Button/Button";
import { FormCard } from "@/components/ui/FormCard/FormCard";
import { TextField } from "@/components/ui/TextField/TextField";
import { LoginFormValues, loginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/auth/useLogin";
import styles from "./AuthForm.module.scss";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });
  const login = useLogin();

  return (
    <FormCard
      title="Увійти"
      subtitle="Раді бачити знову. Введіть дані свого акаунту."
      footer={
        <>
          Немає акаунту? <Link href="/register">Зареєструватись</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit(values => login.mutate(values))}>
        <TextField
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="password"
          type="password"
          label="Пароль"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Link href="/forgot-password" className={styles.forgotLink}>
          Забули пароль?
        </Link>
        {login.isError && <p className={styles.formError}>{(login.error as Error).message}</p>}
        <Button type="submit" fullWidth disabled={login.isPending}>
          {login.isPending ? "Вхід..." : "Увійти"}
        </Button>
      </form>
    </FormCard>
  );
}
