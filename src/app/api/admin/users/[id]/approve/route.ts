import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "관리자 권한이 필요합니다" }, { status: 403 });
  }

  const { id } = await params;
  const { approve } = await request.json();

  if (approve) {
    await prisma.user.update({
      where: { id },
      data: { isApproved: true },
    });
  } else {
    // 거부 시 사용자 삭제
    await prisma.user.delete({ where: { id } });
  }

  return NextResponse.json({ success: true });
}
