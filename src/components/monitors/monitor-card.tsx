"use client";

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
}

interface MonitorCardProps {
  monitor: Monitor;
  onToggle: () => void;
  onDelete: () => void;
}

export function MonitorCard({ monitor, onToggle, onDelete }: MonitorCardProps) {
  const isActive = monitor.status === "active";
  const totalPeople = monitor.adults + monitor.children + monitor.infants;

  return (
    <div
      className={`rounded-lg border p-4 ${
        isActive ? "border-blue-200 bg-white" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 노선 */}
          <div className="mb-1 flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {monitor.flyFrom} → {monitor.flyTo}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
              }`}
            >
              {isActive ? "활성" : "일시정지"}
            </span>
          </div>

          {/* 상세 */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>{monitor.flightType === "round" ? "왕복" : "편도"}</span>
            <span>{totalPeople}명</span>
            {monitor.nightsFrom && monitor.nightsTo && (
              <span>
                {monitor.nightsFrom}~{monitor.nightsTo}박
              </span>
            )}
            {monitor.maxPrice && <span>목표: {monitor.maxPrice.toLocaleString("ko-KR")}원</span>}
          </div>
        </div>

        {/* 액션 */}
        <div className="flex gap-1">
          <button
            onClick={onToggle}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
          >
            {isActive ? "일시정지" : "재개"}
          </button>
          <button
            onClick={onDelete}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
