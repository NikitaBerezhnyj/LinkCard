import { z } from "zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Мінімум 3 символи").max(32, "Максимум 32 символи"),
  email: z.string().email("Некоректний email"),
  bio: z.string().max(280, "Максимум 280 символів").optional()
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
