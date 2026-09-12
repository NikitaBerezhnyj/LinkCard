"use client";

import { Button } from "@/components/ui/Button/Button";
import { FormCard } from "@/components/ui/FormCard/FormCard";
import { TextField } from "@/components/ui/TextField/TextField";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import styles from "./AuthForm.module.scss";

export function ResetPasswordForm({ token }: { token: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });
  const resetPassword = useResetPassword(token);

  return (
    <FormCard title="Новий пароль" subtitle="Придумайте новий пароль для акаунту.">
      <form className={styles.form} onSubmit={handleSubmit(values => resetPassword.mutate(values))}>
        <TextField
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          id="newPassword"
          type="password"
          label="Новий пароль"
          placeholder="••••••••"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />
        {resetPassword.isError && (
          <p className={styles.formError}>{(resetPassword.error as Error).message}</p>
        )}
        <Button type="submit" fullWidth disabled={resetPassword.isPending}>
          {resetPassword.isPending ? "Збереження..." : "Зберегти новий пароль"}
        </Button>
      </form>
    </FormCard>
  );
}
