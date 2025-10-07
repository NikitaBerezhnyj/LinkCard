"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import styles from "@/styles/pages/Auth.module.scss";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await authService.register({ username, email, password });

    if (response.error) {
      setError(response.error);
      return;
    }

    router.push("/login");
  };

  return (
    <main className={styles.mainWrapper}>
      <div className={styles.formContainer}>
        <h1>Register</h1>
        <br />
        <form
          onSubmit={handleRegister}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            type="text"
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            error={error && username === "" ? "Username is required" : undefined}
            required
          />
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
            Already have an account? <a href="/login">Login</a>
          </p>

          {error && <p className={styles.errorMessage}>{error}</p>}
          <Button type="submit" variant="primary">
            Register
          </Button>
        </form>
      </div>
    </main>
  );
}
