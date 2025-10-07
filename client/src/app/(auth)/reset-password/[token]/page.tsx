"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const tokenStr = Array.isArray(token) ? token[0] : token;

    if (!tokenStr) {
      setError("Invalid token");
      return;
    }

    const response = await authService.resetPassword(tokenStr, { email, password });

    if (response.error) {
      setError(response.error);
      return;
    }

    setMessage(response.data?.message || "Password reset successful.");
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.formContainer}>
        <h1>Reset Password</h1>
        <br />
        <form
          onSubmit={handleSubmit}
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
            label="New Password"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={error && password === "" ? "Password is required" : undefined}
            showPasswordToggle
            required
          />

          {error && <p className={styles.errorMessage}>{error}</p>}
          {message && <p className={styles.successMessage}>{message}</p>}

          <Button type="submit" variant="primary">
            Reset Password
          </Button>
        </form>
      </div>
    </main>
  );
}
