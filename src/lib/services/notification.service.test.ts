import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendDealNotification, hasRecentNotification } from "./notification.service";

vi.mock("@/lib/db", () => ({
  prisma: {
    notification: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    deal: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/email/send", () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: "email_1" }),
}));

import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email/send";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("hasRecentNotification", () => {
  it("24시간 이내 같은 유형 알림이 있으면 true를 반환한다", async () => {
    vi.mocked(prisma.notification.findFirst).mockResolvedValueOnce({
      id: "notif_1",
      monitorId: "mon_1",
      dealType: "price_drop",
      sentAt: new Date(),
    });

    const result = await hasRecentNotification("mon_1", "price_drop");
    expect(result).toBe(true);
  });

  it("24시간 이내 알림이 없으면 false를 반환한다", async () => {
    vi.mocked(prisma.notification.findFirst).mockResolvedValueOnce(null);

    const result = await hasRecentNotification("mon_1", "price_drop");
    expect(result).toBe(false);
  });
});

describe("sendDealNotification", () => {
  it("이메일을 발송하고 알림 로그를 기록한다", async () => {
    vi.mocked(prisma.notification.findFirst).mockResolvedValueOnce(null);
    vi.mocked(prisma.deal.create).mockResolvedValueOnce({
      id: "deal_1",
      monitorId: "mon_1",
      price: 300000,
      dropRate: 20,
      dealType: "price_drop",
      airline: "KE",
      bookingUrl: "https://example.com",
      detectedAt: new Date(),
    });
    vi.mocked(prisma.notification.create).mockResolvedValueOnce({
      id: "notif_1",
      monitorId: "mon_1",
      dealType: "price_drop",
      sentAt: new Date(),
    });

    const result = await sendDealNotification(
      {
        monitorId: "mon_1",
        price: 300000,
        dropRate: 20,
        dealType: "price_drop",
        airline: "KE",
        bookingUrl: "https://example.com",
      },
      "user@example.com"
    );

    expect(result).toBe(true);
    expect(sendEmail).toHaveBeenCalledOnce();
    expect(prisma.deal.create).toHaveBeenCalledOnce();
    expect(prisma.notification.create).toHaveBeenCalledOnce();
  });

  it("24시간 이내 중복 알림이면 발송하지 않는다", async () => {
    vi.mocked(prisma.notification.findFirst).mockResolvedValueOnce({
      id: "notif_1",
      monitorId: "mon_1",
      dealType: "price_drop",
      sentAt: new Date(),
    });

    const result = await sendDealNotification(
      {
        monitorId: "mon_1",
        price: 300000,
        dealType: "price_drop",
      },
      "user@example.com"
    );

    expect(result).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
