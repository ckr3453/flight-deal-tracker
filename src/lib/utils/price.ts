/**
 * 숫자 → "₩1,234,567" KRW 포맷
 */
export function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

/**
 * 하락률 계산: (이전 - 현재) / 이전 × 100
 * 양수 = 하락, 음수 = 상승
 */
export function calculateDropRate(previousPrice: number, currentPrice: number): number {
  if (previousPrice === 0) return 0;
  return ((previousPrice - currentPrice) / previousPrice) * 100;
}

/**
 * 숫자 배열 평균 계산
 */
export function calculateAverage(prices: number[]): number {
  if (prices.length === 0) return 0;
  return prices.reduce((sum, p) => sum + p, 0) / prices.length;
}
