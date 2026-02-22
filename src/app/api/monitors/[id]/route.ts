import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateMonitor, deleteMonitor, toggleMonitorStatus } from "@/lib/services/monitor.service";
import { updateMonitorSchema } from "@/lib/validators/monitor.schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // toggle 액션 처리
  if (body.action === "toggle") {
    try {
      const monitor = await toggleMonitorStatus(id, session.user.id);
      return NextResponse.json(monitor);
    } catch {
      return NextResponse.json({ error: "모니터를 찾을 수 없습니다" }, { status: 404 });
    }
  }

  // 일반 업데이트
  const result = updateMonitorSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  try {
    const monitor = await updateMonitor(id, session.user.id, result.data);
    return NextResponse.json(monitor);
  } catch {
    return NextResponse.json({ error: "모니터를 찾을 수 없습니다" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteMonitor(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "모니터를 찾을 수 없습니다" }, { status: 404 });
  }
}
