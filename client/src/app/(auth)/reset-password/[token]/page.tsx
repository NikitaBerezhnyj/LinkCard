"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authService } from "@/services/AuthService";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const router = useRouter();
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
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Reset Password</h1>
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
        <Input
          type="password"
          label="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
        <Button type="submit" variant="primary">
          Reset Password
        </Button>
      </form>
    </main>
  );
}
