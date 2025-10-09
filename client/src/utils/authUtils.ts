import { cookies } from "next/headers";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token");
  return Boolean(token?.value);
}
