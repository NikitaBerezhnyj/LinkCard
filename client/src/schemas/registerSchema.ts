import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Мінімум 3 символи").max(32, "Максимум 32 символи"),
  email: z.string().email("Некоректний email"),
  password: z.string().min(8, "Мінімум 8 символів")
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
