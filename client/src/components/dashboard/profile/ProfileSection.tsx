"use client";

import { Button } from "@/components/ui/Button/Button";
import { SectionCard } from "@/components/ui/SectionCard/SectionCard";
import { TextField } from "@/components/ui/TextField/TextField";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { useUpdateProfile } from "@/hooks/dashboard/useUpdateProfile";
import { ProfileFormValues, profileSchema } from "@/schemas/profileSchema";
import { IUser } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
    <SectionCard
      title="Профіль"
      description="Основна інформація про вас та вашу картку."
      hint={isDirty ? "Є незбережені зміни" : undefined}
      footer={
        <Button type="submit" form="profile-form" disabled={!isDirty || updateProfile.isPending}>
          {updateProfile.isPending ? "Збереження..." : "Зберегти зміни"}
        </Button>
      }
    >
      <AvatarUploader avatarUrl={user.avatar} username={user.username} />

      <form
        id="profile-form"
        className={styles.form}
        onSubmit={handleSubmit(values => {
          const payload = {
            ...values,
            bio: values.bio?.trim() || undefined
          };

          updateProfile.mutate(payload);
        })}
      >
        <div className={styles.row}>
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
        </div>

        <Textarea
          id="bio"
          label="Про себе"
          placeholder="Коротко про вас — з'явиться на вашій картці"
          rows={3}
          error={errors.bio?.message}
          {...register("bio")}
        />
      </form>
    </SectionCard>
  );
}
