import z from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().email("Некоректний email"),
  newPassword: z.string().min(8, "Мінімум 8 символів")
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
