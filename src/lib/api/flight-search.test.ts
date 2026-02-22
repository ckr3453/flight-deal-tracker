import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchFlightsNormalized } from "./flight-search";
import * as tequila from "./tequila";

vi.mock("./tequila");

const mockSearchFlights = vi.mocked(tequila.searchFlights);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("searchFlightsNormalized", () => {
  it("Tequila 결과를 FlightResult[]로 변환한다", async () => {
    mockSearchFlights.mockResolvedValueOnce({
      search_id: "abc",
      data: [
        {
          id: "f1",
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
    });

    const results = await searchFlightsNormalized({
      flyFrom: "ICN",
      flyTo: "NRT",
      dateFrom: "01/03/2026",
      dateTo: "31/03/2026",
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      price: 350000,
      airline: "KE",
      flyFrom: "ICN",
      flyTo: "NRT",
      departureDate: "2026-03-01T10:00:00.000Z",
      returnDate: undefined,
      bookingUrl: "https://kiwi.com/booking/abc",
      duration: {
        departure: 150,
        return: 165,
      },
    });
  });

  it("빈 결과를 빈 배열로 반환한다", async () => {
    mockSearchFlights.mockResolvedValueOnce({
      search_id: "empty",
      data: [],
      currency: "KRW",
    });

    const results = await searchFlightsNormalized({
      flyFrom: "ICN",
      flyTo: "XYZ",
      dateFrom: "01/03/2026",
      dateTo: "31/03/2026",
    });

    expect(results).toEqual([]);
  });

  it("왕복 항공편의 returnDate를 포함한다", async () => {
    mockSearchFlights.mockResolvedValueOnce({
      search_id: "round",
      data: [
        {
          id: "f2",
          price: 500000,
          airlines: ["OZ"],
          route: [
            {
              flyFrom: "ICN",
              flyTo: "NRT",
              cityFrom: "Seoul",
              cityTo: "Tokyo",
              local_departure: "2026-03-01T10:00:00.000Z",
              local_arrival: "2026-03-01T12:30:00.000Z",
              airline: "OZ",
            },
            {
              flyFrom: "NRT",
              flyTo: "ICN",
              cityFrom: "Tokyo",
              cityTo: "Seoul",
              local_departure: "2026-03-08T14:00:00.000Z",
              local_arrival: "2026-03-08T17:00:00.000Z",
              airline: "OZ",
            },
          ],
          deep_link: "https://kiwi.com/booking/round",
          fly_duration: "2h 30m",
          return_duration: "3h 00m",
          local_departure: "2026-03-01T10:00:00.000Z",
          local_arrival: "2026-03-01T12:30:00.000Z",
          utc_departure: "2026-03-01T01:00:00.000Z",
          utc_arrival: "2026-03-01T03:30:00.000Z",
        },
      ],
      currency: "KRW",
    });

    const results = await searchFlightsNormalized({
      flyFrom: "ICN",
      flyTo: "NRT",
      dateFrom: "01/03/2026",
      dateTo: "31/03/2026",
      flightType: "round",
    });

    expect(results[0].returnDate).toBe("2026-03-08T14:00:00.000Z");
  });
});
