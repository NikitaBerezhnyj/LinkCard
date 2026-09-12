import { serverApi } from "@/lib/serverApi";
import { clearRefreshCookie, getRefreshCookie } from "@/utils/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  const refreshToken = await getRefreshCookie();

  if (refreshToken) {
    await serverApi.post("/auth/logout", { refreshToken }).catch(() => {});
  }

  await clearRefreshCookie();

  return NextResponse.json({ success: true });
}
