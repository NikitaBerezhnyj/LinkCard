import { serverApi } from "@/lib/serverApi";
import { IAuthResponse } from "@/types/auth";
import { setRefreshCookie } from "@/utils/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, status, ok } = await serverApi.post<IAuthResponse>("/auth/login", body);

  if (!ok) {
    return NextResponse.json(data, { status });
  }

  await setRefreshCookie(data.refreshToken);

  return NextResponse.json({
    accessToken: data.accessToken,
    user: data.user
  });
}
