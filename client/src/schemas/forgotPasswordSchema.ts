import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Некоректний email")
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
