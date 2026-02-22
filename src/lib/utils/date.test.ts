import { describe, it, expect } from "vitest";
import {
  formatDateForTequila,
  getSearchDateRange,
  getDaysFromNow,
  convertNightsToDateRange,
  getRecentDaysRange,
} from "./date";

describe("formatDateForTequila", () => {
  it("Date를 DD/MM/YYYY 포맷으로 변환한다", () => {
    const date = new Date(2026, 1, 22); // 2026-02-22
    expect(formatDateForTequila(date)).toBe("22/02/2026");
  });

  it("선행 0을 포함한다 (1월 5일)", () => {
    const date = new Date(2026, 0, 5); // 2026-01-05
    expect(formatDateForTequila(date)).toBe("05/01/2026");
  });

  it("12월 31일을 올바르게 변환한다", () => {
    const date = new Date(2026, 11, 31);
    expect(formatDateForTequila(date)).toBe("31/12/2026");
  });
});

describe("getSearchDateRange", () => {
  it("오늘부터 N일 후까지의 범위를 반환한다", () => {
    const now = new Date(2026, 1, 22);
    const { dateFrom, dateTo } = getSearchDateRange(30, now);
    expect(dateFrom).toBe("22/02/2026");
    expect(dateTo).toBe("24/03/2026");
  });

  it("기본값은 오늘부터 60일 후", () => {
    const now = new Date(2026, 0, 1);
    const { dateFrom, dateTo } = getSearchDateRange(60, now);
    expect(dateFrom).toBe("01/01/2026");
    expect(dateTo).toBe("02/03/2026");
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
    expect(dateFrom).toBe("22/02/2026");
    expect(dateTo).toBe("25/02/2026");
  });

  it("1박2일도 올바르게 처리한다", () => {
    const departure = new Date(2026, 11, 31);
    const { dateFrom, dateTo } = convertNightsToDateRange(1, departure);
    expect(dateFrom).toBe("31/12/2026");
    expect(dateTo).toBe("01/01/2027");
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
