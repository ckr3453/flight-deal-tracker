import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createMonitor, getMonitorsByUser } from "@/lib/services/monitor.service";
import { createMonitorSchema } from "@/lib/validators/monitor.schema";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!session.user.isApproved) {
    return NextResponse.json({ error: "관리자 승인이 필요합니다" }, { status: 403 });
  }

  const monitors = await getMonitorsByUser(session.user.id);
  return NextResponse.json(monitors);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!session.user.isApproved) {
    return NextResponse.json({ error: "관리자 승인이 필요합니다" }, { status: 403 });
  }

  const body = await request.json();
  const result = createMonitorSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const monitor = await createMonitor(session.user.id, result.data);
  return NextResponse.json(monitor, { status: 201 });
}
