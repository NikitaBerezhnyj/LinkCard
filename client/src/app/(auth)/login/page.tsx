"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";
import { validateEmail } from "@/utils/validations";
import { useUserStore } from "@/store/userStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useUserStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Email is required.");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password) {
      setError("Password is required.");
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
        <h1>Login</h1>
        <br />
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={error && email === "" ? "Email is required" : undefined}
            required
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={error && password === "" ? "Password is required" : undefined}
            showPasswordToggle
            required
          />

          <p className={styles.helperText}>
            Don’t have an account yet? <a href="/register">Sign up now</a>
          </p>
          <p className={styles.helperText}>
            Forgot your password? <a href="/forgot-password">Reset it here</a>
          </p>

          {error && <p className={styles.errorMessage}>{error}</p>}
          <Button type="submit" variant="primary">
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}
