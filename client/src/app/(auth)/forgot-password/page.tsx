"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";
import { validateEmail } from "@/utils/validations";
import { useTranslation } from "react-i18next";
import Loader from "@/components/modals/Loader";

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (i18n.isInitialized) setIsReady(true);
  }, [i18n.isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    if (!email) {
      setError(t("auth.emailRequired"));
      setIsLoading(false);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.forgotPassword({ email });

      if (response.error) {
        setError(response.error);
        return;
      }

      setMessage(response.data?.message || t("auth.checkEmailInstructions"));
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
        <h1>{t("auth.forgotPasswordTitle")}</h1>
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

          <p className={styles.helperText}>
            {t("auth.helperBackToLogin")} <a href="/login">{t("auth.loginButton")}</a>
          </p>

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
            {t("auth.sendResetLink")}
          </Button>
        </form>
      </div>
    </main>
  );
}
