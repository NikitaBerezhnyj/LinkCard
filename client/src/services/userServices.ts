import { clientApi } from "@/lib/clientApi";
import { IUpdateUserPayload, IUser, IUserSearchResult } from "@/types/user";

export async function getPublicUser(username: string): Promise<IUser | null> {
  const res = await fetch(`${process.env.BACKEND_API_URL}/users/${username}`, {
    cache: "no-store"
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Не вдалося завантажити картку");
  }

  return res.json();
}

export async function searchUsers(username?: string): Promise<IUserSearchResult[]> {
  const { data } = await clientApi.get<IUserSearchResult[]>("/users/search", {
    params: username?.trim() ? { username: username.trim() } : undefined
  });

  return data;
}

export async function getCurrentUser(): Promise<IUser> {
  const { data } = await clientApi.get<IUser>("/users/me");
  return data;
}

export async function updateCurrentUser(payload: IUpdateUserPayload): Promise<IUser> {
  const { data } = await clientApi.patch<IUser>("/users/me", payload);
  return data;
}

export async function uploadAvatar(file: File | Blob): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("file", file, "avatar.jpg");

  const { data } = await clientApi.put<{ avatarUrl: string }>("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
}

export async function uploadBackgroundImage(file: File): Promise<{ backgroundUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await clientApi.put<{ backgroundUrl: string }>(
    "/users/me/background",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return data;
}
