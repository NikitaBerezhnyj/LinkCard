"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";
import { validateUsername, validateEmail, validatePassword } from "@/utils/validations";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import Loader from "@/components/modals/Loader";

export default function RegisterPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUserStore();

  useEffect(() => {
    if (i18n.isInitialized) setIsReady(true);
  }, [i18n.isInitialized]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!username) {
      setError(t("auth.usernameRequired"));
      setIsLoading(false);
      return;
    }

    if (!email) {
      setError(t("auth.emailRequired"));
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError(t("auth.passwordRequired"));
      setIsLoading(false);
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      setIsLoading(false);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setIsLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.register({ username, email, password });

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data?.username) setUser(response.data.username);

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
        <h1>{t("auth.registerTitle")}</h1>
        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            type="text"
            label={t("auth.username")}
            placeholder={t("auth.usernamePlaceholder")}
            value={username}
            onChange={e => setUsername(e.target.value)}
            error={error && username === "" ? t("auth.usernameRequired") : undefined}
            required
          />
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
            placeholder={t("auth.passwordPlaceholder")}
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={error && password === "" ? t("auth.passwordRequired") : undefined}
            showPasswordToggle
            required
          />

          <p className={styles.helperText}>
            {t("auth.helperHaveAccount")} <a href="/login">{t("auth.loginButton")}</a>
          </p>

          {error && (
            <div role="alert" className={styles.errorMessage}>
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={isLoading}>
            {t("auth.registerButton")}
          </Button>
        </form>
      </div>
    </main>
  );
}
