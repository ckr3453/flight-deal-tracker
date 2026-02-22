import type {
  TequilaSearchParams,
  TequilaSearchResponse,
  TequilaLocationResponse,
} from "@/types/tequila";

const BASE_URL = "https://tequila-api.kiwi.com";
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;
const DAILY_RATE_LIMIT = 100;

// 일일 API 호출 카운터 (서버 재시작 시 리셋)
let dailyCallCount = 0;
let lastResetDate = new Date().toDateString();

function checkRateLimit(): void {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyCallCount = 0;
    lastResetDate = today;
  }
  if (dailyCallCount >= DAILY_RATE_LIMIT) {
    throw new TequilaError(429, `일일 API 호출 한도 초과 (${DAILY_RATE_LIMIT}회)`);
  }
  dailyCallCount++;
}

export function getRateLimitStatus(): { count: number; limit: number } {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    return { count: 0, limit: DAILY_RATE_LIMIT };
  }
  return { count: dailyCallCount, limit: DAILY_RATE_LIMIT };
}

export function resetRateLimit(): void {
  dailyCallCount = 0;
}

export class TequilaError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "TequilaError";
  }
}

function getApiKey(): string {
  const key = process.env.TEQUILA_API_KEY;
  if (!key) throw new Error("TEQUILA_API_KEY가 설정되지 않았습니다");
  return key;
}

function isRetryable(status: number): boolean {
  return status === 429 || status >= 500;
}

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.ok) return response;

      if (!isRetryable(response.status)) {
        throw new TequilaError(
          response.status,
          `Tequila API 오류: ${response.status} ${response.statusText}`
        );
      }

      lastError = new TequilaError(
        response.status,
        `Tequila API 오류: ${response.status} ${response.statusText}`
      );
    } catch (error) {
      if (error instanceof TequilaError && !isRetryable(error.status)) {
        throw error;
      }
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < MAX_RETRIES - 1) {
      const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError instanceof TequilaError
    ? lastError
    : new TequilaError(0, lastError?.message ?? "네트워크 오류");
}

export async function searchFlights(params: TequilaSearchParams): Promise<TequilaSearchResponse> {
  checkRateLimit();
  const searchParams = new URLSearchParams({
    fly_from: params.fly_from,
    fly_to: params.fly_to,
    date_from: params.date_from,
    date_to: params.date_to,
    curr: params.curr ?? "KRW",
    sort: params.sort ?? "price",
    limit: String(params.limit ?? 20),
    locale: params.locale ?? "ko",
  });

  if (params.flight_type) searchParams.set("flight_type", params.flight_type);
  if (params.nights_in_dst_from != null)
    searchParams.set("nights_in_dst_from", String(params.nights_in_dst_from));
  if (params.nights_in_dst_to != null)
    searchParams.set("nights_in_dst_to", String(params.nights_in_dst_to));
  if (params.adults != null) searchParams.set("adults", String(params.adults));
  if (params.children != null) searchParams.set("children", String(params.children));
  if (params.infants != null) searchParams.set("infants", String(params.infants));

  const url = `${BASE_URL}/v2/search?${searchParams}`;
  const response = await fetchWithRetry(url, {
    headers: { apikey: getApiKey() },
  });

  return response.json();
}

export async function searchLocations(term: string): Promise<TequilaLocationResponse> {
  checkRateLimit();
  const searchParams = new URLSearchParams({
    term,
    location_types: "city,airport",
    locale: "ko",
  });

  const url = `${BASE_URL}/locations/query?${searchParams}`;
  const response = await fetchWithRetry(url, {
    headers: { apikey: getApiKey() },
  });

  return response.json();
}
