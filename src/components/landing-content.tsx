"use client";

import { signIn } from "next-auth/react";

export function LandingContent() {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <h2 className="mb-4 text-3xl font-bold text-gray-900">항공권 핫딜을 놓치지 마세요</h2>
      <p className="mb-8 max-w-md text-lg text-gray-600">
        원하는 노선과 조건을 설정하면, 가격이 떨어질 때 이메일로 알려드립니다.
      </p>
      <ul className="mb-10 space-y-2 text-left text-gray-700">
        <li>- 7일 평균 대비 15% 이상 하락 시 알림</li>
        <li>- 목표 가격 이하 항공편 발견 시 알림</li>
        <li>- 역대 최저가 갱신 시 알림</li>
      </ul>
      <button
        onClick={() => signIn("google")}
        className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700"
      >
        시작하기
      </button>
    </div>
  );
}
