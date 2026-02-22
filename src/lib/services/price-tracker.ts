import { prisma } from "@/lib/db";

interface PriceInput {
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  count: number;
}

export async function recordPrice(monitorId: string, input: PriceInput) {
  return prisma.priceRecord.create({
    data: {
      monitorId,
      ...input,
    },
  });
}

export async function getRecentPrices(monitorId: string, days: number = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return prisma.priceRecord.findMany({
    where: {
      monitorId,
      checkedAt: { gte: since },
    },
    orderBy: { checkedAt: "desc" },
  });
}

export async function getAllPrices(monitorId: string) {
  return prisma.priceRecord.findMany({
    where: { monitorId },
    orderBy: { checkedAt: "desc" },
  });
}
