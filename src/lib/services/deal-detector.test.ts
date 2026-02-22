import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectDeals } from "./deal-detector";

vi.mock("@/lib/db", () => ({
  prisma: {
    notification: {
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";

const baseMonitor = {
  id: "mon_1",
  userId: "user_1",
  flyFrom: "ICN",
  flyTo: "NRT",
  flightType: "round",
  adults: 1,
  children: 0,
  infants: 0,
  nightsFrom: 5,
  nightsTo: 7,
  dateFrom: null,
  dateTo: null,
  maxPrice: 400000,
  status: "active" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
  // 기본: 최근 알림 없음
  vi.mocked(prisma.notification.findFirst).mockResolvedValue(null);
});

describe("detectDeals", () => {
  describe("가격 하락 감지", () => {
    it("7일 평균 대비 15% 이상 하락 시 딜을 감지한다", async () => {
      const recentPrices = [
        { minPrice: 400000, avgPrice: 400000, maxPrice: 400000, count: 5 },
        { minPrice: 380000, avgPrice: 380000, maxPrice: 380000, count: 5 },
        { minPrice: 420000, avgPrice: 420000, maxPrice: 420000, count: 5 },
      ];
      const currentMinPrice = 330000; // 평균 400000 대비 17.5% 하락

      const deals = await detectDeals(baseMonitor, recentPrices, [], currentMinPrice);

      const priceDrop = deals.find((d) => d.dealType === "price_drop");
      expect(priceDrop).toBeDefined();
      expect(priceDrop!.dropRate).toBeGreaterThanOrEqual(15);
    });

    it("이력이 3건 미만이면 가격 하락을 감지하지 않는다", async () => {
      const recentPrices = [
        { minPrice: 400000, avgPrice: 400000, maxPrice: 400000, count: 5 },
        { minPrice: 380000, avgPrice: 380000, maxPrice: 380000, count: 5 },
      ];
      const currentMinPrice = 300000;

      const deals = await detectDeals(baseMonitor, recentPrices, [], currentMinPrice);

      expect(deals.find((d) => d.dealType === "price_drop")).toBeUndefined();
    });

    it("15% 미만 하락은 감지하지 않는다", async () => {
      const recentPrices = [
        { minPrice: 400000, avgPrice: 400000, maxPrice: 400000, count: 5 },
        { minPrice: 380000, avgPrice: 380000, maxPrice: 380000, count: 5 },
        { minPrice: 420000, avgPrice: 420000, maxPrice: 420000, count: 5 },
      ];
      const currentMinPrice = 360000; // 평균 400000 대비 10% 하락

      const deals = await detectDeals(baseMonitor, recentPrices, [], currentMinPrice);

      expect(deals.find((d) => d.dealType === "price_drop")).toBeUndefined();
    });
  });

  describe("목표 가격 이하 감지", () => {
    it("maxPrice 이하 발견 시 딜을 감지한다", async () => {
      const currentMinPrice = 350000; // maxPrice 400000 이하

      const deals = await detectDeals(baseMonitor, [], [], currentMinPrice);

      const underTarget = deals.find((d) => d.dealType === "under_target");
      expect(underTarget).toBeDefined();
      expect(underTarget!.price).toBe(350000);
    });

    it("maxPrice 초과 시 감지하지 않는다", async () => {
      const currentMinPrice = 450000;

      const deals = await detectDeals(baseMonitor, [], [], currentMinPrice);

      expect(deals.find((d) => d.dealType === "under_target")).toBeUndefined();
    });

    it("maxPrice가 설정되지 않으면 감지하지 않는다", async () => {
      const monitorNoMax = { ...baseMonitor, maxPrice: null };
      const currentMinPrice = 100000;

      const deals = await detectDeals(monitorNoMax, [], [], currentMinPrice);

      expect(deals.find((d) => d.dealType === "under_target")).toBeUndefined();
    });
  });

  describe("역대 최저가 감지", () => {
    it("전체 이력 최저가 갱신 시 딜을 감지한다 (이력 5건+)", async () => {
      const allPrices = [
        { minPrice: 500000 },
        { minPrice: 480000 },
        { minPrice: 460000 },
        { minPrice: 440000 },
        { minPrice: 420000 },
      ];
      const currentMinPrice = 380000; // 역대 최저 420000보다 낮음

      const deals = await detectDeals(baseMonitor, [], allPrices, currentMinPrice);

      const allTimeLow = deals.find((d) => d.dealType === "all_time_low");
      expect(allTimeLow).toBeDefined();
    });

    it("이력이 5건 미만이면 감지하지 않는다", async () => {
      const allPrices = [{ minPrice: 500000 }, { minPrice: 480000 }];
      const currentMinPrice = 300000;

      const deals = await detectDeals(baseMonitor, [], allPrices, currentMinPrice);

      expect(deals.find((d) => d.dealType === "all_time_low")).toBeUndefined();
    });

    it("최저가를 갱신하지 못하면 감지하지 않는다", async () => {
      const allPrices = [
        { minPrice: 300000 },
        { minPrice: 350000 },
        { minPrice: 400000 },
        { minPrice: 450000 },
        { minPrice: 500000 },
      ];
      const currentMinPrice = 320000; // 역대 최저 300000보다 높음

      const deals = await detectDeals(baseMonitor, [], allPrices, currentMinPrice);

      expect(deals.find((d) => d.dealType === "all_time_low")).toBeUndefined();
    });
  });

  describe("24시간 중복 알림 방지", () => {
    it("24시간 이내 같은 유형 알림이 있으면 해당 딜을 제외한다", async () => {
      vi.mocked(prisma.notification.findFirst).mockResolvedValue({
        id: "notif_1",
        monitorId: "mon_1",
        dealType: "under_target",
        sentAt: new Date(),
      });

      const currentMinPrice = 350000;

      const deals = await detectDeals(baseMonitor, [], [], currentMinPrice);

      expect(deals.find((d) => d.dealType === "under_target")).toBeUndefined();
    });
  });
});
