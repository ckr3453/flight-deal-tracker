import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";
import { formatKRW } from "@/lib/utils/price";
import type { DetectedDeal, DealType } from "@/types/deal";

const DEAL_TYPE_LABELS: Record<DealType, string> = {
  price_drop: "가격 하락",
  under_target: "목표 가격 도달",
  all_time_low: "역대 최저가",
};

export async function hasRecentNotification(
  monitorId: string,
  dealType: DealType
): Promise<boolean> {
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

export async function sendDealNotification(
  deal: DetectedDeal,
  userEmail: string
): Promise<boolean> {
  // 24시간 중복 방지
  if (await hasRecentNotification(deal.monitorId, deal.dealType)) {
    return false;
  }

  const label = DEAL_TYPE_LABELS[deal.dealType];
  const subject = `[항공권 핫딜] ${label} - ${formatKRW(deal.price)}`;

  let body = `<h2>${label}</h2><p>가격: ${formatKRW(deal.price)}</p>`;
  if (deal.dropRate) {
    body += `<p>하락률: ${deal.dropRate}%</p>`;
  }
  if (deal.airline) {
    body += `<p>항공사: ${deal.airline}</p>`;
  }
  if (deal.bookingUrl) {
    body += `<p><a href="${deal.bookingUrl}">예약하기</a></p>`;
  }

  await sendEmail({ to: userEmail, subject, html: body });

  // Deal + Notification 기록
  await prisma.deal.create({
    data: {
      monitorId: deal.monitorId,
      price: deal.price,
      dropRate: deal.dropRate,
      dealType: deal.dealType,
      airline: deal.airline,
      bookingUrl: deal.bookingUrl,
    },
  });

  await prisma.notification.create({
    data: {
      monitorId: deal.monitorId,
      dealType: deal.dealType,
    },
  });

  return true;
}
