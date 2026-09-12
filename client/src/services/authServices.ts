import { ForgotPasswordFormValues } from "@/schemas/forgotPasswordSchema";
import { LoginFormValues } from "@/schemas/loginSchema";
import { RegisterFormValues } from "@/schemas/registerSchema";
import { ResetPasswordFormValues } from "@/schemas/resetPasswordSchema";
import { IAuthResponse } from "@/types/auth";

async function parseJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Сталася помилка");
  return data;
}

export async function loginRequest(
  payload: LoginFormValues
): Promise<{ accessToken: string; user?: IAuthResponse["user"] }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJsonOrThrow(res);
}

export async function registerRequest(
  payload: RegisterFormValues
): Promise<{ accessToken: string; user?: IAuthResponse["user"] }> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJsonOrThrow(res);
}

export async function forgotPasswordRequest(payload: ForgotPasswordFormValues) {
  const res = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJsonOrThrow(res);
}

export async function resetPasswordRequest(token: string, payload: ResetPasswordFormValues) {
  const res = await fetch(`/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJsonOrThrow(res);
}

export async function logoutRequest() {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  return parseJsonOrThrow(res);
}
