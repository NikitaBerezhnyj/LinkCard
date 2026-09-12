import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { resetPasswordRequest } from "@/services/authServices";
import { ResetPasswordFormValues } from "@/schemas/resetPasswordSchema";

export function useResetPassword(token: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordFormValues) => resetPasswordRequest(token, payload),
    onSuccess: () => router.push("/login")
  });
}
