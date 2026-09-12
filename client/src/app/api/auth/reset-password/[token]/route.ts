import { serverApi } from "@/lib/serverApi";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  const body = await request.json();

  const { data, status } = await serverApi.post(`/auth/password/reset/${params.token}`, body);

  return NextResponse.json(data, { status });
}
