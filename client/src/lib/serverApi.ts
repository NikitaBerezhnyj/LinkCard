interface RequestResult<T> {
  data: T;
  status: number;
  ok: boolean;
}

class ServerApi {
  private readonly baseURL = process.env.BACKEND_API_URL;

  private async request<T>(path: string, init?: RequestInit): Promise<RequestResult<T>> {
    const res = await fetch(`${this.baseURL}${path}`, {
      ...init,
      headers: {
        ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(init?.headers ?? {})
      }
    });

    const data = (await res.json().catch(() => ({}))) as T;

    return {
      data,
      status: res.status,
      ok: res.ok
    };
  }

  get<T>(path: string, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: "GET"
    });
  }

  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  patch<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: "PATCH",
      body: JSON.stringify(body)
    });
  }

  put<T>(path: string, body?: unknown, init?: RequestInit) {
    return this.request<T>(path, {
      ...init,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }
}

export const serverApi = new ServerApi();
