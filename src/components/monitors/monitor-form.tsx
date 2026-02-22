"use client";

import { useState } from "react";
import { KOREAN_AIRPORTS } from "@/constants/airports";
import { POPULAR_REGIONS } from "@/constants/regions";

interface MonitorFormProps {
  onCreated: () => void;
}

export function MonitorForm({ onCreated }: MonitorFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [flyFrom, setFlyFrom] = useState("ICN");
  const [flyTo, setFlyTo] = useState("");
  const [flightType, setFlightType] = useState<"round" | "oneway">("round");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [nightsFrom, setNightsFrom] = useState(3);
  const [nightsTo, setNightsTo] = useState(5);
  const [maxPrice, setMaxPrice] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        flyFrom,
        flyTo,
        flightType,
        adults,
        children,
        infants,
      };

      if (flightType === "round") {
        body.nightsFrom = nightsFrom;
        body.nightsTo = nightsTo;
      }

      if (maxPrice) {
        body.maxPrice = parseInt(maxPrice);
      }

      const res = await fetch("/api/monitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.[0]?.message || data.error || "모니터 생성 실패");
      }

      // 초기화
      setFlyTo("");
      setMaxPrice("");
      setIsOpen(false);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center text-gray-500 hover:border-blue-400 hover:text-blue-600"
      >
        + 새 모니터링 추가
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">새 모니터링 설정</h2>

      {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {/* 출발지 */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">출발지</label>
        <select
          value={flyFrom}
          onChange={(e) => setFlyFrom(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {KOREAN_AIRPORTS.map((a) => (
            <option key={a.code} value={a.code}>
              {a.city} ({a.code})
            </option>
          ))}
        </select>
      </div>

      {/* 목적지 */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">목적지</label>
        <select
          value={flyTo}
          onChange={(e) => setFlyTo(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">선택하세요</option>
          {POPULAR_REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.nameKo} ({r.code})
            </option>
          ))}
        </select>
      </div>

      {/* 편도/왕복 */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">여행 유형</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFlightType("round")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              flightType === "round"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            왕복
          </button>
          <button
            type="button"
            onClick={() => setFlightType("oneway")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${
              flightType === "oneway"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            편도
          </button>
        </div>
      </div>

      {/* 숙박일 (왕복만) */}
      {flightType === "round" && (
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">최소 숙박</label>
            <input
              type="number"
              min={1}
              max={30}
              value={nightsFrom}
              onChange={(e) => setNightsFrom(parseInt(e.target.value) || 1)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">최대 숙박</label>
            <input
              type="number"
              min={1}
              max={30}
              value={nightsTo}
              onChange={(e) => setNightsTo(parseInt(e.target.value) || 1)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}

      {/* 인원 */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">인원</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-0.5 block text-xs text-gray-500">성인</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(9, adults + 1))}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="mb-0.5 block text-xs text-gray-500">아동</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{children}</span>
              <button
                type="button"
                onClick={() => setChildren(Math.min(3, children + 1))}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="mb-0.5 block text-xs text-gray-500">유아</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInfants(Math.max(0, infants - 1))}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{infants}</span>
              <button
                type="button"
                onClick={() => setInfants(Math.min(3, infants + 1))}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 희망 가격 */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          희망 최대 가격 (선택)
        </label>
        <input
          type="number"
          min={50000}
          max={5000000}
          step={10000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="예: 300000"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {maxPrice && (
          <p className="mt-1 text-xs text-gray-500">
            {parseInt(maxPrice).toLocaleString("ko-KR")}원 이하 발견 시 알림
          </p>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "생성 중..." : "모니터링 시작"}
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
        >
          취소
        </button>
      </div>
    </form>
  );
}
