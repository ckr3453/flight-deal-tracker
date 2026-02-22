"use client";

import { useRouter } from "next/navigation";

interface UserInfo {
  id: string;
  name: string | null;
  email: string;
  role?: string;
  isApproved?: boolean;
  createdAt: string;
}

interface AdminDashboardProps {
  pendingUsers: UserInfo[];
  allUsers: UserInfo[];
  totalMonitors: number;
  activeMonitors: number;
}

export function AdminDashboard({
  pendingUsers,
  allUsers,
  totalMonitors,
  activeMonitors,
}: AdminDashboardProps) {
  const router = useRouter();

  async function handleApprove(userId: string, approve: boolean) {
    const res = await fetch(`/api/admin/users/${userId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve }),
    });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      {/* 모니터 현황 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalMonitors}</p>
          <p className="text-sm text-gray-600">전체 모니터</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{activeMonitors}</p>
          <p className="text-sm text-gray-600">활성 모니터</p>
        </div>
      </div>

      {/* 승인 대기 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          승인 대기 ({pendingUsers.length})
        </h2>
        {pendingUsers.length === 0 ? (
          <p className="text-sm text-gray-500">대기 중인 사용자가 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{user.name || "이름 없음"}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(user.id, true)}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleApprove(user.id, false)}
                    className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200"
                  >
                    거부
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 전체 사용자 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          전체 사용자 ({allUsers.length})
        </h2>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-2 font-medium text-gray-700">이름</th>
                <th className="px-4 py-2 font-medium text-gray-700">이메일</th>
                <th className="px-4 py-2 font-medium text-gray-700">상태</th>
                <th className="px-4 py-2 font-medium text-gray-700">역할</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-2 text-gray-900">{user.name || "-"}</td>
                  <td className="px-4 py-2 text-gray-600">{user.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        user.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.isApproved ? "승인" : "대기"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {user.role === "admin" ? "관리자" : "사용자"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
