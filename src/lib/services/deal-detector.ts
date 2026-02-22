import { prisma } from "@/lib/db";
import { calculateDropRate, calculateAverage } from "@/lib/utils/price";
import type { DealType, DetectedDeal } from "@/types/deal";

const PRICE_DROP_THRESHOLD = 15; // 15% 이상 하락
const PRICE_DROP_MIN_RECORDS = 3; // 최소 3건
const ALL_TIME_LOW_MIN_RECORDS = 5; // 최소 5건

interface PriceSnapshot {
  minPrice: number;
  avgPrice?: number;
  maxPrice?: number;
  count?: number;
}

interface MonitorLike {
  id: string;
  maxPrice: number | null;
}

async function hasRecentNotification(monitorId: string, dealType: DealType): Promise<boolean> {
  const since = new Date();
  since.setHours(since.getHours() - 24);

  const existing = await prisma.notification.findFirst({
    where: {
      monitorId,
      dealType,
      sentAt: { gte: since },
    },
  });

  return existing !== null;
}

export async function detectDeals(
  monitor: MonitorLike,
  recentPrices: PriceSnapshot[],
  allPrices: PriceSnapshot[],
  currentMinPrice: number
): Promise<DetectedDeal[]> {
  const deals: DetectedDeal[] = [];

  // 1. 가격 하락: 7일 평균 대비 15% 이상 (이력 3건+)
  if (recentPrices.length >= PRICE_DROP_MIN_RECORDS) {
    const avgOfRecent = calculateAverage(recentPrices.map((p) => p.minPrice));
    const dropRate = calculateDropRate(avgOfRecent, currentMinPrice);

    if (dropRate >= PRICE_DROP_THRESHOLD) {
      deals.push({
        monitorId: monitor.id,
        price: currentMinPrice,
        dropRate: Math.round(dropRate * 100) / 100,
        dealType: "price_drop",
      });
    }
  }

  // 2. 목표 가격 이하
  if (monitor.maxPrice !== null && currentMinPrice <= monitor.maxPrice) {
    deals.push({
      monitorId: monitor.id,
      price: currentMinPrice,
      dealType: "under_target",
    });
  }

  // 3. 역대 최저가 (이력 5건+)
  if (allPrices.length >= ALL_TIME_LOW_MIN_RECORDS) {
    const historicalMin = Math.min(...allPrices.map((p) => p.minPrice));
    if (currentMinPrice < historicalMin) {
      deals.push({
        monitorId: monitor.id,
        price: currentMinPrice,
        dealType: "all_time_low",
      });
    }
  }

  // 24시간 중복 방지: 최근 알림이 있는 유형은 제외
  const filteredDeals: DetectedDeal[] = [];
  for (const deal of deals) {
    const hasRecent = await hasRecentNotification(monitor.id, deal.dealType);
    if (!hasRecent) {
      filteredDeals.push(deal);
    }
  }

  return filteredDeals;
}
