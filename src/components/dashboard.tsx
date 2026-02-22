"use client";

import { useSession } from "next-auth/react";
import { MonitorForm } from "@/components/monitors/monitor-form";
import { MonitorList } from "@/components/monitors/monitor-list";
import { useState } from "react";

export function Dashboard() {
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!session?.user?.isApproved) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-yellow-800">관리자 승인 대기 중</h2>
        <p className="text-yellow-700">
          가입이 완료되었습니다. 관리자 승인 후 서비스를 이용하실 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MonitorForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <MonitorList key={refreshKey} />
    </div>
  );
}
