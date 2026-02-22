import type { SerpApiSearchParams, SerpApiSearchResponse } from "@/types/serpapi";

const BASE_URL = "https://serpapi.com/search";
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;
const MONTHLY_RATE_LIMIT = 100;

// 월간 API 호출 카운터 (서버 재시작 시 리셋)
let monthlyCallCount = 0;
let lastResetMonth = new Date().getMonth();

function checkRateLimit(): void {
  const currentMonth = new Date().getMonth();
  if (currentMonth !== lastResetMonth) {
    monthlyCallCount = 0;
    lastResetMonth = currentMonth;
  }
  if (monthlyCallCount >= MONTHLY_RATE_LIMIT) {
    throw new SerpApiError(429, `월간 API 호출 한도 초과 (${MONTHLY_RATE_LIMIT}회)`);
  }
  monthlyCallCount++;
}

export function getRateLimitStatus(): { count: number; limit: number } {
  const currentMonth = new Date().getMonth();
  if (currentMonth !== lastResetMonth) {
    return { count: 0, limit: MONTHLY_RATE_LIMIT };
  }
  return { count: monthlyCallCount, limit: MONTHLY_RATE_LIMIT };
}

export function resetRateLimit(): void {
  monthlyCallCount = 0;
}

export class SerpApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "SerpApiError";
  }
}

function getApiKey(): string {
  const key = process.env.SERPAPI_API_KEY;
  if (!key) throw new Error("SERPAPI_API_KEY가 설정되지 않았습니다");
  return key;
}

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);

      if (response.ok) return response;

      if (!isRetryable(response.status)) {
        throw new SerpApiError(
          response.status,
          `SerpApi 오류: ${response.status} ${response.statusText}`
        );
      }

      lastError = new SerpApiError(
        response.status,
        `SerpApi 오류: ${response.status} ${response.statusText}`
      );
    } catch (error) {
      if (error instanceof SerpApiError && !isRetryable(error.status)) {
        throw error;
      }
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < MAX_RETRIES - 1) {
      const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError instanceof SerpApiError
    ? lastError
    : new SerpApiError(0, lastError?.message ?? "네트워크 오류");
}

export async function searchFlights(
  params: SerpApiSearchParams
): Promise<SerpApiSearchResponse> {
  checkRateLimit();

  const searchParams = new URLSearchParams({
    engine: "google_flights",
    api_key: getApiKey(),
    departure_id: params.departure_id,
    arrival_id: params.arrival_id,
    outbound_date: params.outbound_date,
    type: String(params.type),
    currency: params.currency ?? "KRW",
    hl: params.hl ?? "ko",
    gl: params.gl ?? "kr",
  });

  if (params.return_date) searchParams.set("return_date", params.return_date);
  if (params.adults != null) searchParams.set("adults", String(params.adults));
  if (params.children != null) searchParams.set("children", String(params.children));
  if (params.infants_in_seat != null)
    searchParams.set("infants_in_seat", String(params.infants_in_seat));

  const url = `${BASE_URL}?${searchParams}`;
  const response = await fetchWithRetry(url);

  return response.json();
}
