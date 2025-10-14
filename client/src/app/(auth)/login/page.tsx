"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";
import { validateEmail } from "@/utils/validations";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useUserStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError(t("auth.emailRequired"));
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }

    const response = await authService.login({ email, password });

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
        <h1>{t("auth.loginTitle")}</h1>
        <br />
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

          {error && <p className={styles.errorMessage}>{error}</p>}
          <Button type="submit" variant="primary">
            {t("auth.loginButton")}
          </Button>
        </form>
      </div>
    </main>
  );
}
