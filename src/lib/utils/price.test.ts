import { describe, it, expect } from "vitest";
import { formatKRW, calculateDropRate, calculateAverage } from "./price";

describe("formatKRW", () => {
  it("0을 ₩0으로 포맷한다", () => {
    expect(formatKRW(0)).toBe("₩0");
  });

  it("천 단위 구분자를 포함한다", () => {
    expect(formatKRW(1000000)).toBe("₩1,000,000");
  });

  it("소규모 금액도 처리한다", () => {
    expect(formatKRW(350000)).toBe("₩350,000");
  });

  it("큰 금액도 처리한다", () => {
    expect(formatKRW(2345678)).toBe("₩2,345,678");
  });
});

describe("calculateDropRate", () => {
  it("하락률을 %로 계산한다", () => {
    // 300,000 → 250,000 = 16.67% 하락
    const rate = calculateDropRate(300000, 250000);
    expect(rate).toBeCloseTo(16.67, 1);
  });

  it("변동 없으면 0%를 반환한다", () => {
    expect(calculateDropRate(100000, 100000)).toBe(0);
  });

  it("가격 상승 시 음수를 반환한다", () => {
    expect(calculateDropRate(100000, 120000)).toBeCloseTo(-20, 1);
  });

  it("이전 가격이 0이면 0을 반환한다", () => {
    expect(calculateDropRate(0, 100000)).toBe(0);
  });
});

describe("calculateAverage", () => {
  it("숫자 배열의 평균을 계산한다", () => {
    expect(calculateAverage([100, 200, 300])).toBe(200);
  });

  it("단일 요소 배열은 해당 값을 반환한다", () => {
    expect(calculateAverage([500])).toBe(500);
  });

  it("빈 배열은 0을 반환한다", () => {
    expect(calculateAverage([])).toBe(0);
  });
});
