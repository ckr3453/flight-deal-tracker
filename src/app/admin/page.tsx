import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

interface UserRecord {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isApproved: boolean;
  createdAt: Date;
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [pendingUsers, allUsers, monitorStats] = await Promise.all([
    prisma.user.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.monitor.aggregate({
      _count: { _all: true },
      where: undefined,
    }),
  ]);

  const activeMonitors = await prisma.monitor.count({
    where: { status: "active" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">관리자 페이지</h1>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            메인으로
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <AdminDashboard
          pendingUsers={pendingUsers.map((u: UserRecord) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            createdAt: u.createdAt.toISOString(),
          }))}
          allUsers={allUsers.map((u: UserRecord) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            isApproved: u.isApproved,
            createdAt: u.createdAt.toISOString(),
          }))}
          totalMonitors={monitorStats._count._all}
          activeMonitors={activeMonitors}
        />
      </main>
    </div>
  );
}
