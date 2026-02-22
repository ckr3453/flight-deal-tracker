import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  searchFlights,
  SerpApiError,
  resetRateLimit,
  getRateLimitStatus,
} from "./serpapi";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SERPAPI_API_KEY", "test-api-key");
  resetRateLimit();
});

const MOCK_SEARCH_RESPONSE = {
  search_metadata: { status: "Success" },
  best_flights: [
    {
      flights: [
        {
          departure_airport: { name: "인천국제공항", id: "ICN", time: "2026-03-01 10:00" },
          arrival_airport: { name: "나리타국제공항", id: "NRT", time: "2026-03-01 12:30" },
          duration: 150,
          airplane: "A321",
          airline: "대한항공",
          airline_logo: "https://logo.url",
          flight_number: "KE 705",
          travel_class: "Economy",
          legroom: "31 in",
          extensions: [],
        },
      ],
      total_duration: 150,
      price: 350000,
      type: "Round trip",
      airline_logo: "https://logo.url",
    },
  ],
  other_flights: [],
};

describe("searchFlights", () => {
  it("항공편 검색 결과를 반환한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    const result = await searchFlights({
      departure_id: "ICN",
      arrival_id: "NRT",
      outbound_date: "2026-03-01",
      type: 1,
    });

    expect(result.best_flights).toHaveLength(1);
    expect(result.best_flights![0].price).toBe(350000);
    expect(mockFetch).toHaveBeenCalledOnce();

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("serpapi.com/search");
    expect(url).toContain("departure_id=ICN");
    expect(url).toContain("currency=KRW");
    expect(url).toContain("engine=google_flights");
  });

  it("빈 결과를 올바르게 처리한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          search_metadata: { status: "Success" },
          best_flights: [],
          other_flights: [],
        }),
    });

    const result = await searchFlights({
      departure_id: "ICN",
      arrival_id: "XYZ",
      outbound_date: "2026-03-01",
      type: 2,
    });

    expect(result.best_flights).toHaveLength(0);
  });

  it("429 에러 시 재시도한다", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 429, statusText: "Too Many Requests" })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
      });

    const result = await searchFlights({
      departure_id: "ICN",
      arrival_id: "NRT",
      outbound_date: "2026-03-01",
      type: 1,
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.best_flights).toHaveLength(1);
  });

  it("500 에러 시 재시도한다", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Server Error" })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
      });

    const result = await searchFlights({
      departure_id: "ICN",
      arrival_id: "NRT",
      outbound_date: "2026-03-01",
      type: 1,
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.best_flights).toHaveLength(1);
  });

  it("3번 모두 실패 시 SerpApiError를 던진다", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Error" })
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Error" })
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Error" });

    await expect(
      searchFlights({
        departure_id: "ICN",
        arrival_id: "NRT",
        outbound_date: "2026-03-01",
        type: 1,
      })
    ).rejects.toThrow(SerpApiError);

    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it("400 에러는 재시도하지 않는다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
    });

    await expect(
      searchFlights({
        departure_id: "ICN",
        arrival_id: "NRT",
        outbound_date: "2026-03-01",
        type: 1,
      })
    ).rejects.toThrow(SerpApiError);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("네트워크 오류 시 재시도한다", async () => {
    mockFetch.mockRejectedValueOnce(new Error("fetch failed")).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    const result = await searchFlights({
      departure_id: "ICN",
      arrival_id: "NRT",
      outbound_date: "2026-03-01",
      type: 1,
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.best_flights).toHaveLength(1);
  });
});

describe("rate limiter", () => {
  it("호출 횟수를 추적한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    await searchFlights({
      departure_id: "ICN",
      arrival_id: "NRT",
      outbound_date: "2026-03-01",
      type: 1,
    });

    const status = getRateLimitStatus();
    expect(status.count).toBe(1);
    expect(status.limit).toBe(100);
  });

  it("월간 한도 초과 시 에러를 던진다", async () => {
    resetRateLimit();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    const promises = Array.from({ length: 100 }, () =>
      searchFlights({
        departure_id: "ICN",
        arrival_id: "NRT",
        outbound_date: "2026-03-01",
        type: 1,
      })
    );

    await expect(
      Promise.all(promises).then(() =>
        searchFlights({
          departure_id: "ICN",
          arrival_id: "NRT",
          outbound_date: "2026-03-01",
          type: 1,
        })
      )
    ).rejects.toThrow("월간 API 호출 한도 초과");
  });

  it("resetRateLimit()이 카운터를 초기화한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    await searchFlights({
      departure_id: "ICN",
      arrival_id: "NRT",
      outbound_date: "2026-03-01",
      type: 1,
    });
    expect(getRateLimitStatus().count).toBe(1);

    resetRateLimit();
    expect(getRateLimitStatus().count).toBe(0);
  });
});
