import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { searchFlightsNormalized } from "@/lib/api/flight-search";
import { getSearchDateRange } from "@/lib/utils/date";
import { prisma } from "@/lib/db";
import type { FlightType } from "@/types/monitor";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
  }
  if (!session.user.isApproved) {
    return NextResponse.json({ error: "관리자 승인이 필요합니다" }, { status: 403 });
  }

  const { monitorId } = await request.json();
  if (!monitorId) {
    return NextResponse.json({ error: "monitorId가 필요합니다" }, { status: 400 });
  }

  const monitor = await prisma.monitor.findUnique({
    where: { id: monitorId, userId: session.user.id },
  });

  if (!monitor) {
    return NextResponse.json({ error: "모니터를 찾을 수 없습니다" }, { status: 404 });
  }

  // 날짜 범위: 사용자 지정 or 향후 60일
  const dateRange =
    monitor.dateFrom && monitor.dateTo
      ? { dateFrom: monitor.dateFrom, dateTo: monitor.dateTo }
      : getSearchDateRange(60);

  const flights = await searchFlightsNormalized({
    flyFrom: monitor.flyFrom,
    flyTo: monitor.flyTo,
    dateFrom: dateRange.dateFrom,
    dateTo: dateRange.dateTo,
    flightType: monitor.flightType as FlightType,
    adults: monitor.adults,
    children: monitor.children ?? undefined,
    infants: monitor.infants ?? undefined,
    nightsFrom: monitor.nightsFrom ?? undefined,
    nightsTo: monitor.nightsTo ?? undefined,
  });

  return NextResponse.json({ flights, count: flights.length });
}
