import { apiClient } from "@/utils/apiClient";
import { IUser, IUserResponse } from "@/types/IUser";

export const userService = {
  getUser: (username: string) => apiClient.get<IUserResponse>(`/user/${username}`),

  updateUser: (username: string, data: Partial<IUser>) =>
    apiClient.patch<IUserResponse, Partial<IUser>>(`/user/${username}`, data),

  deleteUser: (username: string) => apiClient.delete<{ message: string }>(`/user/${username}`)
};
