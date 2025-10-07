"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const response = await authService.login({ email, password });

    if (response.error) {
      setError(response.error);
      return;
    }

    router.push("/");
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <p>
          Forgot your password?{" "}
          <a href="/forgot-password" style={{ color: "blue" }}>
            Reset here
          </a>
        </p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit" variant="primary">
          Login
        </Button>
      </form>
    </main>
  );
}
