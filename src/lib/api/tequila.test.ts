import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  searchFlights,
  searchLocations,
  TequilaError,
  resetRateLimit,
  getRateLimitStatus,
} from "./tequila";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("TEQUILA_API_KEY", "test-api-key");
  resetRateLimit();
});

const MOCK_SEARCH_RESPONSE = {
  search_id: "abc123",
  data: [
    {
      id: "flight1",
      price: 350000,
      airlines: ["KE"],
      route: [
        {
          flyFrom: "ICN",
          flyTo: "NRT",
          cityFrom: "Seoul",
          cityTo: "Tokyo",
          local_departure: "2026-03-01T10:00:00.000Z",
          local_arrival: "2026-03-01T12:30:00.000Z",
          airline: "KE",
        },
      ],
      deep_link: "https://kiwi.com/booking/abc",
      fly_duration: "2h 30m",
      return_duration: "2h 45m",
      local_departure: "2026-03-01T10:00:00.000Z",
      local_arrival: "2026-03-01T12:30:00.000Z",
      utc_departure: "2026-03-01T01:00:00.000Z",
      utc_arrival: "2026-03-01T03:30:00.000Z",
    },
  ],
  currency: "KRW",
};

describe("searchFlights", () => {
  it("항공편 검색 결과를 반환한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    const result = await searchFlights({
      fly_from: "ICN",
      fly_to: "NRT",
      date_from: "01/03/2026",
      date_to: "31/03/2026",
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].price).toBe(350000);
    expect(mockFetch).toHaveBeenCalledOnce();

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("tequila-api.kiwi.com/v2/search");
    expect(url).toContain("fly_from=ICN");
    expect(url).toContain("curr=KRW");
  });

  it("빈 결과를 올바르게 처리한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ search_id: "empty", data: [], currency: "KRW" }),
    });

    const result = await searchFlights({
      fly_from: "ICN",
      fly_to: "XYZ",
      date_from: "01/03/2026",
      date_to: "31/03/2026",
    });

    expect(result.data).toHaveLength(0);
  });

  it("429 에러 시 재시도한다", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 429, statusText: "Too Many Requests" })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
      });

    const result = await searchFlights({
      fly_from: "ICN",
      fly_to: "NRT",
      date_from: "01/03/2026",
      date_to: "31/03/2026",
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.data).toHaveLength(1);
  });

  it("500 에러 시 재시도한다", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Server Error" })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
      });

    const result = await searchFlights({
      fly_from: "ICN",
      fly_to: "NRT",
      date_from: "01/03/2026",
      date_to: "31/03/2026",
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.data).toHaveLength(1);
  });

  it("3번 모두 실패 시 TequilaError를 던진다", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Error" })
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Error" })
      .mockResolvedValueOnce({ ok: false, status: 500, statusText: "Error" });

    await expect(
      searchFlights({
        fly_from: "ICN",
        fly_to: "NRT",
        date_from: "01/03/2026",
        date_to: "31/03/2026",
      })
    ).rejects.toThrow(TequilaError);

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
        fly_from: "ICN",
        fly_to: "NRT",
        date_from: "01/03/2026",
        date_to: "31/03/2026",
      })
    ).rejects.toThrow(TequilaError);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("네트워크 오류 시 재시도한다", async () => {
    mockFetch.mockRejectedValueOnce(new Error("fetch failed")).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    const result = await searchFlights({
      fly_from: "ICN",
      fly_to: "NRT",
      date_from: "01/03/2026",
      date_to: "31/03/2026",
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result.data).toHaveLength(1);
  });
});

describe("searchLocations", () => {
  it("위치 검색 결과를 반환한다", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          locations: [
            {
              id: "NRT",
              int_id: 1,
              code: "NRT",
              name: "나리타 국제공항",
              city: {
                id: "TYO",
                name: "도쿄",
                code: "TYO",
                country: { id: "JP", name: "일본", code: "JP" },
              },
              type: "airport",
            },
          ],
        }),
    });

    const result = await searchLocations("도쿄");

    expect(result.locations).toHaveLength(1);
    expect(result.locations[0].code).toBe("NRT");

    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("locations/query");
    expect(url).toContain("locale=ko");
  });
});

describe("rate limiter", () => {
  it("호출 횟수를 추적한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    await searchFlights({
      fly_from: "ICN",
      fly_to: "NRT",
      date_from: "01/03/2026",
      date_to: "31/03/2026",
    });

    const status = getRateLimitStatus();
    expect(status.count).toBe(1);
    expect(status.limit).toBe(100);
  });

  it("일일 한도 초과 시 에러를 던진다", async () => {
    // 수동으로 카운터를 한도까지 채움
    for (let i = 0; i < 100; i++) {
      try {
        // checkRateLimit 간접 호출을 위해 resetRateLimit 없이 searchFlights 호출
        // 대신 getRateLimitStatus로 확인
      } catch {
        // ignore
      }
    }

    // resetRateLimit 후 100번 호출해서 한도 도달 시뮬레이션
    resetRateLimit();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    // 100번 호출
    const promises = Array.from({ length: 100 }, () =>
      searchFlights({
        fly_from: "ICN",
        fly_to: "NRT",
        date_from: "01/03/2026",
        date_to: "31/03/2026",
      })
    );

    // 101번째 호출은 에러
    await expect(
      Promise.all(promises).then(() =>
        searchFlights({
          fly_from: "ICN",
          fly_to: "NRT",
          date_from: "01/03/2026",
          date_to: "31/03/2026",
        })
      )
    ).rejects.toThrow("일일 API 호출 한도 초과");
  });

  it("resetRateLimit()이 카운터를 초기화한다", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_SEARCH_RESPONSE),
    });

    await searchFlights({
      fly_from: "ICN",
      fly_to: "NRT",
      date_from: "01/03/2026",
      date_to: "31/03/2026",
    });
    expect(getRateLimitStatus().count).toBe(1);

    resetRateLimit();
    expect(getRateLimitStatus().count).toBe(0);
  });
});
