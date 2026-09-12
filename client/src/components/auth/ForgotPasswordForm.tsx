"use client";

import { Button } from "@/components/ui/Button/Button";
import { FormCard } from "@/components/ui/FormCard/FormCard";
import { TextField } from "@/components/ui/TextField/TextField";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import styles from "./AuthForm.module.scss";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });
  const forgotPassword = useForgotPassword();

  if (forgotPassword.isSuccess) {
    return (
      <FormCard title="Перевірте пошту" footer={<Link href="/login">Повернутись до входу</Link>}>
        <p className={styles.success}>
          Ми надіслали лист для відновлення паролю. Перейдіть за посиланням у листі, щоб продовжити.
        </p>
      </FormCard>
    );
  }

  return (
    <FormCard
      title="Відновити пароль"
      subtitle="Вкажіть email, і ми надішлемо посилання для скидання."
      footer={<Link href="/login">Повернутись до входу</Link>}
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit(values => forgotPassword.mutate(values))}
      >
        <TextField
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        {forgotPassword.isError && (
          <p className={styles.formError}>{(forgotPassword.error as Error).message}</p>
        )}
        <Button type="submit" fullWidth disabled={forgotPassword.isPending}>
          {forgotPassword.isPending ? "Надсилання..." : "Надіслати"}
        </Button>
      </form>
    </FormCard>
  );
}
