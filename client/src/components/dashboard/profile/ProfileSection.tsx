"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/schemas/profileSchema";
import { useUpdateProfile } from "@/hooks/dashboard/useUpdateProfile";
import { IUser } from "@/types/user";
import { SectionCard } from "@/components/ui/SectionCard/SectionCard";
import { TextField } from "@/components/ui/TextField/TextField";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { Button } from "@/components/ui/Button/Button";
import { AvatarUploader } from "./AvatarUploader";
import styles from "./ProfileSection.module.scss";

export function ProfileSection({ user }: { user: IUser }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      username: user.username,
      email: user.email,
      bio: user.bio ?? ""
    }
  });
  const updateProfile = useUpdateProfile();

  return (
    <SectionCard title="Профіль" description="Основна інформація про вас та вашу картку.">
      <AvatarUploader avatarUrl={user.avatar} username={user.username} />
      <form
        className={styles.form}
        onSubmit={handleSubmit(values => {
          const payload = {
            ...values,
            bio: values.bio?.trim() || undefined
          };

          updateProfile.mutate(payload);
        })}
      >
        <TextField
          id="username"
          label="Ім'я користувача"
          error={errors.username?.message}
          {...register("username")}
        />
        <TextField
          id="email"
          type="email"
          label="Email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Textarea
          id="bio"
          label="Про себе"
          placeholder="Коротко про вас — з'явиться на вашій картці"
          rows={3}
          error={errors.bio?.message}
          {...register("bio")}
        />
        <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
          {updateProfile.isPending ? "Збереження..." : "Зберегти зміни"}
        </Button>
      </form>
    </SectionCard>
  );
}
