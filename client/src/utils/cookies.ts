import { cookies } from "next/headers";

const REFRESH_COOKIE_NAME = "refreshToken";

export async function setRefreshCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function getRefreshCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value;
}

export async function clearRefreshCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(REFRESH_COOKIE_NAME);
}
