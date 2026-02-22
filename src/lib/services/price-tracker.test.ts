import { describe, it, expect, vi, beforeEach } from "vitest";
import { recordPrice, getRecentPrices, getAllPrices } from "./price-tracker";

vi.mock("@/lib/db", () => ({
  prisma: {
    priceRecord: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";

const mockRecord = {
  id: "pr_1",
  monitorId: "mon_1",
  minPrice: 300000,
  avgPrice: 350000,
  maxPrice: 400000,
  count: 5,
  checkedAt: new Date("2026-02-22T12:00:00Z"),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("recordPrice", () => {
  it("가격 이력을 기록한다", async () => {
    vi.mocked(prisma.priceRecord.create).mockResolvedValueOnce(mockRecord);

    const result = await recordPrice("mon_1", {
      minPrice: 300000,
      avgPrice: 350000,
      maxPrice: 400000,
      count: 5,
    });

    expect(result).toEqual(mockRecord);
    expect(prisma.priceRecord.create).toHaveBeenCalledWith({
      data: {
        monitorId: "mon_1",
        minPrice: 300000,
        avgPrice: 350000,
        maxPrice: 400000,
        count: 5,
      },
    });
  });
});

describe("getRecentPrices", () => {
  it("최근 7일 이력을 반환한다", async () => {
    vi.mocked(prisma.priceRecord.findMany).mockResolvedValueOnce([mockRecord]);

    const result = await getRecentPrices("mon_1", 7);

    expect(result).toHaveLength(1);
    expect(prisma.priceRecord.findMany).toHaveBeenCalledWith({
      where: {
        monitorId: "mon_1",
        checkedAt: { gte: expect.any(Date) },
      },
      orderBy: { checkedAt: "desc" },
    });
  });
});

describe("getAllPrices", () => {
  it("전체 이력을 반환한다", async () => {
    vi.mocked(prisma.priceRecord.findMany).mockResolvedValueOnce([mockRecord, mockRecord]);

    const result = await getAllPrices("mon_1");

    expect(result).toHaveLength(2);
    expect(prisma.priceRecord.findMany).toHaveBeenCalledWith({
      where: { monitorId: "mon_1" },
      orderBy: { checkedAt: "desc" },
    });
  });
});
