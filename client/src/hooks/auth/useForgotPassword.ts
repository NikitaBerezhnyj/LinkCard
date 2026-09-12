import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest } from "@/services/authServices";
import { ForgotPasswordFormValues } from "@/schemas/forgotPasswordSchema";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordFormValues) => forgotPasswordRequest(payload)
  });
}
