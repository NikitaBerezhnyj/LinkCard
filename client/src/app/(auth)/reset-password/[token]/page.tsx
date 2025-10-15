"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";
import { validatePassword } from "@/utils/validations";
import { useTranslation } from "react-i18next";
import Loader from "@/components/modals/Loader";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (i18n.isInitialized) setIsReady(true);
  }, [i18n.isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    if (!password) {
      setError(t("auth.passwordRequired"));
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    const tokenStr = Array.isArray(token) ? token[0] : token;
    if (!tokenStr) {
      setError(t("auth.invalidToken"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword(tokenStr, { password });

      if (response.error) {
        setError(response.error);
        return;
      }

      setMessage(response.data?.message || t("auth.passwordResetSuccess"));
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady || isLoading) return <Loader isOpen={true} />;

  return (
    <main className={styles.mainWrapper} aria-busy={isLoading}>
      <div className={styles.formContainer}>
        <h1>{t("auth.resetPasswordTitle")}</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
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

          {error && (
            <div role="alert" className={styles.errorMessage}>
              {error}
            </div>
          )}
          {message && (
            <div role="alert" className={styles.successMessage}>
              {message}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={isLoading}>
            {t("auth.resetPasswordButton")}
          </Button>
        </form>
      </div>
    </main>
  );
}
