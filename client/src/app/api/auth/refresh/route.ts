import { serverApi } from "@/lib/serverApi";
import { IAuthResponse } from "@/types/auth";
import { clearRefreshCookie, getRefreshCookie, setRefreshCookie } from "@/utils/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  const refreshToken = await getRefreshCookie();

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const { data, ok } = await serverApi.post<IAuthResponse>("/auth/refresh", { refreshToken });

  if (!ok) {
    await clearRefreshCookie();

    return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
  }

  await setRefreshCookie(data.refreshToken);

  return NextResponse.json({
    accessToken: data.accessToken
  });
}
