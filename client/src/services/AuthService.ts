import { apiClient } from "@/utils/apiClient";
import { IAuthResponse, IRegisterRequest, ILoginRequest } from "@/types/IAuth";

export const authService = {
  healthCheck: () => apiClient.get<{ status: string }>("/healthcheck"),

  register: (data: { username: string; email: string; password: string }) =>
    apiClient.post<IAuthResponse, IRegisterRequest>("/register", data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<IAuthResponse, ILoginRequest>("/login", data),

  forgotPassword: (data: { email: string }) =>
    apiClient.post<{ message: string }, { email: string }>("/password/forgot", data),

  resetPassword: (token: string, data: { email: string; password: string }) =>
    apiClient.post<{ message: string }, { email: string; password: string }>(
      `/password/reset/${token}`,
      data
    ),

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get<{ data: unknown }>("/user/profile");
      return response.data?.data ?? null;
    } catch {
      return null;
    }
  },

  logout: () => apiClient.post<{ message: string }, void>("/logout")
};
