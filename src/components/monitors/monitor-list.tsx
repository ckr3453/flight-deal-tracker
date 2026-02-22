"use client";

import { useEffect, useState } from "react";
import { MonitorCard } from "./monitor-card";

interface Monitor {
  id: string;
  flyFrom: string;
  flyTo: string;
  flightType: string;
  adults: number;
  children: number;
  infants: number;
  nightsFrom: number | null;
  nightsTo: number | null;
  maxPrice: number | null;
  status: string;
  createdAt: string;
}

export function MonitorList() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMonitors() {
    try {
      const res = await fetch("/api/monitors");
      if (res.ok) {
        const data = await res.json();
        setMonitors(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMonitors();
  }, []);

  async function handleToggle(id: string) {
    const res = await fetch(`/api/monitors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle" }),
    });
    if (res.ok) {
      fetchMonitors();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 모니터를 삭제하시겠습니까?")) return;
    const res = await fetch(`/api/monitors/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchMonitors();
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-gray-500">불러오는 중...</div>;
  }

  if (monitors.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        등록된 모니터링이 없습니다. 위에서 새로 추가해보세요.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">내 모니터링 ({monitors.length})</h2>
      <div className="space-y-3">
        {monitors.map((monitor) => (
          <MonitorCard
            key={monitor.id}
            monitor={monitor}
            onToggle={() => handleToggle(monitor.id)}
            onDelete={() => handleDelete(monitor.id)}
          />
        ))}
      </div>
    </div>
  );
}
