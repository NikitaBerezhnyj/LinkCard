"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";
import { validatePassword } from "@/utils/validations";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return setError(passwordError);
    }

    const tokenStr = Array.isArray(token) ? token[0] : token;

    if (!tokenStr) {
      setError(t("auth.invalidToken"));
      return;
    }

    const response = await authService.resetPassword(tokenStr, { email, password });

    if (response.error) {
      setError(response.error);
      return;
    }

    setMessage(response.data?.message || t("auth.passwordResetSuccess"));
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.formContainer}>
        <h1>{t("auth.resetPasswordTitle")}</h1>
        <br />
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            type="email"
            label={t("auth.email")}
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={error && email === "" ? t("auth.emailRequired") : undefined}
            required
          />
          <Input
            type="password"
            label={t("auth.newPassword")}
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={error && password === "" ? t("auth.passwordRequired") : undefined}
            showPasswordToggle
            required
          />

          {error && <p className={styles.errorMessage}>{error}</p>}
          {message && <p className={styles.successMessage}>{message}</p>}

          <Button type="submit" variant="primary">
            {t("auth.resetPasswordButton")}
          </Button>
        </form>
      </div>
    </main>
  );
}
