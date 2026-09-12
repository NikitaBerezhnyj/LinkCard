import { serverApi } from "@/lib/serverApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { data, status } = await serverApi.post("/auth/password/forgot", body);

  return NextResponse.json(data, { status });
}
