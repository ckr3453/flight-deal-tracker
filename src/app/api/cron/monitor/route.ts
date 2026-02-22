import { NextRequest, NextResponse } from "next/server";
import { getActiveMonitors } from "@/lib/services/monitor.service";
import { recordPrice, getRecentPrices, getAllPrices } from "@/lib/services/price-tracker";
import { detectDeals } from "@/lib/services/deal-detector";
import { sendDealNotification } from "@/lib/services/notification.service";
import { searchFlightsNormalized } from "@/lib/api/flight-search";
import { getSearchDateRange } from "@/lib/utils/date";
import type { FlightType } from "@/types/monitor";

export async function GET(request: NextRequest) {
  // CRON_SECRET 인증
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monitors = await getActiveMonitors();
  const results: { monitorId: string; flights: number; deals: number; error?: string }[] = [];

  for (const monitor of monitors) {
    try {
      // 날짜 범위: 사용자 지정 or 향후 60일
      const dateRange =
        monitor.dateFrom && monitor.dateTo
          ? { dateFrom: monitor.dateFrom, dateTo: monitor.dateTo }
          : getSearchDateRange(60);

      // 1. 항공편 검색
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

      if (flights.length === 0) {
        results.push({ monitorId: monitor.id, flights: 0, deals: 0 });
        continue;
      }

      // 2. 가격 통계 계산 및 기록
      const prices = flights.map((f) => f.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

      await recordPrice(monitor.id, {
        minPrice,
        avgPrice,
        maxPrice,
        count: flights.length,
      });

      // 3. 핫딜 감지
      const recentPrices = await getRecentPrices(monitor.id);
      const allPrices = await getAllPrices(monitor.id);
      const deals = await detectDeals(monitor, recentPrices, allPrices, minPrice);

      // 4. 알림 발송
      let dealsSent = 0;
      const cheapestFlight = flights.reduce((a, b) => (a.price < b.price ? a : b));

      for (const deal of deals) {
        const enrichedDeal = {
          ...deal,
          airline: cheapestFlight.airline,
          bookingUrl: cheapestFlight.bookingUrl,
        };

        const sent = await sendDealNotification(enrichedDeal, monitor.user.email!);
        if (sent) dealsSent++;
      }

      results.push({ monitorId: monitor.id, flights: flights.length, deals: dealsSent });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      results.push({ monitorId: monitor.id, flights: 0, deals: 0, error: message });
    }
  }

  return NextResponse.json({
    processed: monitors.length,
    results,
  });
}
