import { prisma } from "@/lib/db";
import type { CreateMonitorInput, UpdateMonitorInput } from "@/lib/validators/monitor.schema";

export async function createMonitor(userId: string, input: CreateMonitorInput) {
  return prisma.monitor.create({
    data: {
      userId,
      ...input,
    },
  });
}

export async function updateMonitor(id: string, userId: string, input: UpdateMonitorInput) {
  return prisma.monitor.update({
    where: { id, userId },
    data: input,
  });
}

export async function deleteMonitor(id: string, userId: string) {
  return prisma.monitor.delete({
    where: { id, userId },
  });
}

export async function getMonitorsByUser(userId: string) {
  return prisma.monitor.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveMonitors() {
  return prisma.monitor.findMany({
    where: { status: "active" },
    include: { user: true },
  });
}

export async function toggleMonitorStatus(id: string, userId: string) {
  const monitor = await prisma.monitor.findUnique({
    where: { id, userId },
  });

  if (!monitor) {
    throw new Error("모니터를 찾을 수 없습니다");
  }

  const newStatus = monitor.status === "active" ? "paused" : "active";

  return prisma.monitor.update({
    where: { id, userId },
    data: { status: newStatus },
  });
}
