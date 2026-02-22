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
