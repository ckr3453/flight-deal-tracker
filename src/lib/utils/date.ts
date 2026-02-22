/**
 * Date → Tequila API용 DD/MM/YYYY 포맷
 */
export function formatDateForTequila(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/**
 * 기준일로부터 N일 후 검색 범위 반환
 */
export function getSearchDateRange(
  daysAhead: number,
  from: Date = new Date()
): { dateFrom: string; dateTo: string } {
  return {
    dateFrom: formatDateForTequila(from),
    dateTo: formatDateForTequila(getDaysFromNow(daysAhead, from)),
  };
}

/**
 * 기준일로부터 N일 후 Date 반환
 */
export function getDaysFromNow(days: number, from: Date = new Date()): Date {
  const result = new Date(from);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * n박(n+1)일 → [출발일, 귀국일] 반환 (Tequila DD/MM/YYYY 포맷)
 */
export function convertNightsToDateRange(
  nights: number,
  departureDate: Date = new Date()
): { dateFrom: string; dateTo: string } {
  const returnDate = getDaysFromNow(nights, departureDate);
  return {
    dateFrom: formatDateForTequila(departureDate),
    dateTo: formatDateForTequila(returnDate),
  };
}

/**
 * 최근 N일 범위 반환 (가격 비교용) - 오늘 기준 N일 전 ~ 오늘
 */
export function getRecentDaysRange(
  days: number,
  from: Date = new Date()
): { start: Date; end: Date } {
  const start = new Date(from);
  start.setDate(start.getDate() - days);
  return { start, end: from };
}
