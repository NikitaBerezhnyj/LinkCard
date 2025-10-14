"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";
import { validateUsername, validateEmail, validatePassword } from "@/utils/validations";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useUserStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username) {
      setError(t("auth.usernameRequired"));
      return;
    }

    if (!email) {
      setError(t("auth.emailRequired"));
      return;
    }

    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      return setError(usernameError);
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return setError(emailError);
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return setError(passwordError);
    }

    const response = await authService.register({ username, email, password });

    if (response.error) {
      setError(response.error);
      return;
    }

    if (response.data?.username) {
      setUser(response.data.username);
    }

    router.push("/");
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.formContainer}>
        <h1>{t("auth.registerTitle")}</h1>
        <br />
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

          {error && <p className={styles.errorMessage}>{error}</p>}
          <Button type="submit" variant="primary">
            {t("auth.registerButton")}
          </Button>
        </form>
      </div>
    </main>
  );
}
