import { useAuthStore } from "@/stores/authStore";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL
});

clientApi.interceptors.request.use(config => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", { method: "POST" })
      .then(res => (res.ok ? res.json() : null))
      .then(data => data?.accessToken ?? null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

clientApi.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        useAuthStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return clientApi(originalRequest);
      }

      useAuthStore.getState().clearAuth();
    }

    return Promise.reject(error);
  }
);
