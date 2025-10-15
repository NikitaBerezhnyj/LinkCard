"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";
import { validateEmail } from "@/utils/validations";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import Loader from "@/components/modals/Loader";

export default function LoginPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useUserStore();

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    }
  }, [i18n.isInitialized]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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

    if (!password) {
      setError(t("auth.passwordRequired"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.login({ email, password });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data?.username) {
        setUser(response.data.username);
      }

      router.push("/");
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
        <h1>{t("auth.loginTitle")}</h1>
        <form
          onSubmit={handleLogin}
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
            label={t("auth.password")}
            placeholder={t("auth.password")}
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={error && password === "" ? t("auth.passwordRequired") : undefined}
            showPasswordToggle
            required
          />

          <p className={styles.helperText}>
            {t("auth.helperNoAccount")} <a href="/register">{t("auth.registerButton")}</a>
          </p>
          <p className={styles.helperText}>
            {t("auth.helperForgotPassword")}{" "}
            <a href="/forgot-password">{t("auth.resetPasswordButton")}</a>
          </p>

          {error && (
            <div role="alert" className={styles.errorMessage}>
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={isLoading}>
            {t("auth.loginButton")}
          </Button>
        </form>
      </div>
    </main>
  );
}
