"use client";

import { useState } from "react";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const response = await authService.forgotPassword({ email });

    if (response.error) {
      setError(response.error);
      return;
    }

    setMessage(response.data?.message || "Check your email for instructions.");
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Forgot Password</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <Button type="submit" variant="primary">
          Send Reset Link
        </Button>
      </form>
    </main>
  );
}
