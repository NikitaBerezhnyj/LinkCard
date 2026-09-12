"use client";

import { Button } from "@/components/ui/Button/Button";
import { FormCard } from "@/components/ui/FormCard/FormCard";
import { TextField } from "@/components/ui/TextField/TextField";
import { RegisterFormValues, registerSchema } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRegister } from "../../hooks/auth/useRegister";
import styles from "./AuthForm.module.scss";

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });
  const registerMutation = useRegister();

  return (
    <FormCard
      title="Створити картку"
      subtitle="Займе менше хвилини."
      footer={
        <>
          Вже є акаунт? <Link href="/login">Увійти</Link>
        </>
      }
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit(values => registerMutation.mutate(values))}
      >
        <TextField
          id="username"
          label="Ім'я користувача"
          placeholder="yourname"
          error={errors.username?.message}
          {...register("username")}
        />
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
        {registerMutation.isError && (
          <p className={styles.formError}>{(registerMutation.error as Error).message}</p>
        )}
        <Button type="submit" fullWidth disabled={registerMutation.isPending}>
          {registerMutation.isPending ? "Реєстрація..." : "Зареєструватись"}
        </Button>
      </form>
    </FormCard>
  );
}
