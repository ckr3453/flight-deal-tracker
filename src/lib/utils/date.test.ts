import { describe, it, expect } from "vitest";
import {
  formatDateForApi,
  getSearchDateRange,
  getDaysFromNow,
  convertNightsToDateRange,
  getRecentDaysRange,
} from "./date";

describe("formatDateForApi", () => {
  it("Date를 YYYY-MM-DD 포맷으로 변환한다", () => {
    const date = new Date(2026, 1, 22); // 2026-02-22
    expect(formatDateForApi(date)).toBe("2026-02-22");
  });

  it("선행 0을 포함한다 (1월 5일)", () => {
    const date = new Date(2026, 0, 5); // 2026-01-05
    expect(formatDateForApi(date)).toBe("2026-01-05");
  });

  it("12월 31일을 올바르게 변환한다", () => {
    const date = new Date(2026, 11, 31);
    expect(formatDateForApi(date)).toBe("2026-12-31");
  });
});

describe("getSearchDateRange", () => {
  it("오늘부터 N일 후까지의 범위를 반환한다", () => {
    const now = new Date(2026, 1, 22);
    const { dateFrom, dateTo } = getSearchDateRange(30, now);
    expect(dateFrom).toBe("2026-02-22");
    expect(dateTo).toBe("2026-03-24");
  });

  it("기본값은 오늘부터 60일 후", () => {
    const now = new Date(2026, 0, 1);
    const { dateFrom, dateTo } = getSearchDateRange(60, now);
    expect(dateFrom).toBe("2026-01-01");
    expect(dateTo).toBe("2026-03-02");
  });
});

describe("getDaysFromNow", () => {
  it("N일 후의 Date를 반환한다", () => {
    const now = new Date(2026, 1, 22);
    const result = getDaysFromNow(7, now);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2); // 3월 (0-indexed)
    expect(result.getDate()).toBe(1);
  });

  it("0일이면 같은 날짜를 반환한다", () => {
    const now = new Date(2026, 1, 22);
    const result = getDaysFromNow(0, now);
    expect(result.getDate()).toBe(22);
  });
});

describe("convertNightsToDateRange", () => {
  it("3박4일 → 출발일~3일 후 귀국일을 반환한다", () => {
    const departure = new Date(2026, 1, 22);
    const { dateFrom, dateTo } = convertNightsToDateRange(3, departure);
    expect(dateFrom).toBe("2026-02-22");
    expect(dateTo).toBe("2026-02-25");
  });

  it("1박2일도 올바르게 처리한다", () => {
    const departure = new Date(2026, 11, 31);
    const { dateFrom, dateTo } = convertNightsToDateRange(1, departure);
    expect(dateFrom).toBe("2026-12-31");
    expect(dateTo).toBe("2027-01-01");
  });
});

describe("getRecentDaysRange", () => {
  it("최근 7일 범위를 반환한다", () => {
    const now = new Date(2026, 1, 22);
    const { start, end } = getRecentDaysRange(7, now);
    expect(start.getDate()).toBe(15);
    expect(end).toBe(now);
  });

  it("최근 0일이면 같은 날을 반환한다", () => {
    const now = new Date(2026, 1, 22);
    const { start, end } = getRecentDaysRange(0, now);
    expect(start.getDate()).toBe(22);
    expect(end).toBe(now);
  });
});
