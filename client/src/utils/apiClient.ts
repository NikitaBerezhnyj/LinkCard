import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number | null;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout = 5000) {
    this.client = axios.create({
      baseURL,
      timeout,
      withCredentials: true,
      headers: {}
    });

    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/logout")
        ) {
          originalRequest._retry = true;

          await new Promise(resolve => setTimeout(resolve, 100));

          try {
            return await this.client(originalRequest);
          } catch (retryError) {
            return Promise.reject(retryError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async request<T, D = undefined>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<ApiResponse<T>> {
    try {
      const headers =
        data === undefined
          ? { "Content-Type": "application/json" }
          : data instanceof FormData
            ? {}
            : { "Content-Type": "application/json" };

      const response = await this.client.request<T>({
        method,
        url,
        data,
        ...config,
        headers: { ...headers, ...config?.headers }
      });

      return {
        data: response.data,
        error: null,
        status: response.status
      };
    } catch (err: unknown) {
      let message = "Unknown error";
      let status: number | null = null;

      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        status = axiosErr.response?.status ?? null;

        if (axiosErr.code === "ECONNABORTED") {
          message = "Request timeout (no response for 5 seconds)";
          console.error(`[API Error] ${method.toUpperCase()} ${url}: ${message}`);
        } else if (!axiosErr.response) {
          message = "No response from server";
          console.error(`[API Error] ${method.toUpperCase()} ${url}: ${message}`);
        } else if (axiosErr.response?.data?.message) {
          message = axiosErr.response.data.message;
        } else {
          message = `Server error (${status})`;
          console.error(`[API Error] ${method.toUpperCase()} ${url}: ${message}`);
        }
      } else if (err instanceof Error) {
        message = err.message;
        console.error(`[API Error] ${method.toUpperCase()} ${url}: ${message}`);
      }

      return {
        data: null,
        error: message,
        status
      };
    }
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>("get", url, undefined, config);
  }

  public post<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<ApiResponse<T>> {
    return this.request<T, D>("post", url, data, config);
  }

  public put<T, D>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<ApiResponse<T>> {
    return this.request<T, D>("put", url, data, config);
  }

  public patch<T, D>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<ApiResponse<T>> {
    return this.request<T, D>("patch", url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>("delete", url, undefined, config);
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const apiClient = new ApiClient(BASE_URL);
