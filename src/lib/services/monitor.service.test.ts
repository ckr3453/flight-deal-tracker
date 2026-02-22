import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMonitor,
  updateMonitor,
  deleteMonitor,
  getMonitorsByUser,
  getActiveMonitors,
  toggleMonitorStatus,
} from "./monitor.service";

vi.mock("@/lib/db", () => ({
  prisma: {
    monitor: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/db";

const mockMonitor = {
  id: "mon_1",
  userId: "user_1",
  flyFrom: "ICN",
  flyTo: "NRT",
  flightType: "round",
  adults: 2,
  children: 0,
  infants: 0,
  nightsFrom: 5,
  nightsTo: 7,
  dateFrom: null,
  dateTo: null,
  maxPrice: 500000,
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createMonitor", () => {
  it("모니터를 생성하고 반환한다", async () => {
    vi.mocked(prisma.monitor.create).mockResolvedValueOnce(mockMonitor);

    const result = await createMonitor("user_1", {
      flyFrom: "ICN",
      flyTo: "NRT",
      flightType: "round",
      adults: 2,
      children: 0,
      infants: 0,
      nightsFrom: 5,
      nightsTo: 7,
      maxPrice: 500000,
    });

    expect(result).toEqual(mockMonitor);
    expect(prisma.monitor.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user_1",
        flyFrom: "ICN",
        flyTo: "NRT",
      }),
    });
  });
});

describe("updateMonitor", () => {
  it("모니터를 부분 업데이트한다", async () => {
    const updated = { ...mockMonitor, maxPrice: 300000 };
    vi.mocked(prisma.monitor.update).mockResolvedValueOnce(updated);

    const result = await updateMonitor("mon_1", "user_1", { maxPrice: 300000 });

    expect(result.maxPrice).toBe(300000);
    expect(prisma.monitor.update).toHaveBeenCalledWith({
      where: { id: "mon_1", userId: "user_1" },
      data: { maxPrice: 300000 },
    });
  });
});

describe("deleteMonitor", () => {
  it("모니터를 삭제한다", async () => {
    vi.mocked(prisma.monitor.delete).mockResolvedValueOnce(mockMonitor);

    await deleteMonitor("mon_1", "user_1");

    expect(prisma.monitor.delete).toHaveBeenCalledWith({
      where: { id: "mon_1", userId: "user_1" },
    });
  });
});

describe("getMonitorsByUser", () => {
  it("사용자의 모니터 목록을 반환한다", async () => {
    vi.mocked(prisma.monitor.findMany).mockResolvedValueOnce([mockMonitor]);

    const result = await getMonitorsByUser("user_1");

    expect(result).toHaveLength(1);
    expect(prisma.monitor.findMany).toHaveBeenCalledWith({
      where: { userId: "user_1" },
      orderBy: { createdAt: "desc" },
    });
  });
});

describe("getActiveMonitors", () => {
  it("활성 상태인 모든 모니터를 반환한다", async () => {
    vi.mocked(prisma.monitor.findMany).mockResolvedValueOnce([mockMonitor]);

    const result = await getActiveMonitors();

    expect(result).toHaveLength(1);
    expect(prisma.monitor.findMany).toHaveBeenCalledWith({
      where: { status: "active" },
      include: { user: true },
    });
  });
});

describe("toggleMonitorStatus", () => {
  it("active → paused로 전환한다", async () => {
    vi.mocked(prisma.monitor.findUnique).mockResolvedValueOnce(mockMonitor);
    vi.mocked(prisma.monitor.update).mockResolvedValueOnce({
      ...mockMonitor,
      status: "paused",
    });

    const result = await toggleMonitorStatus("mon_1", "user_1");

    expect(result.status).toBe("paused");
  });

  it("paused → active로 전환한다", async () => {
    vi.mocked(prisma.monitor.findUnique).mockResolvedValueOnce({
      ...mockMonitor,
      status: "paused",
    });
    vi.mocked(prisma.monitor.update).mockResolvedValueOnce({
      ...mockMonitor,
      status: "active",
    });

    const result = await toggleMonitorStatus("mon_1", "user_1");

    expect(result.status).toBe("active");
  });

  it("존재하지 않는 모니터는 에러를 던진다", async () => {
    vi.mocked(prisma.monitor.findUnique).mockResolvedValueOnce(null);

    await expect(toggleMonitorStatus("invalid", "user_1")).rejects.toThrow(
      "모니터를 찾을 수 없습니다"
    );
  });
});
