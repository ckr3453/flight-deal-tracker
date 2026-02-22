import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchFlightsNormalized } from "./flight-search";
import * as serpapi from "./serpapi";

vi.mock("./serpapi");

const mockSearchFlights = vi.mocked(serpapi.searchFlights);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("searchFlightsNormalized", () => {
  it("SerpApi 결과를 FlightResult[]로 변환한다", async () => {
    mockSearchFlights.mockResolvedValueOnce({
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
    });

    const results = await searchFlightsNormalized({
      flyFrom: "ICN",
      flyTo: "NRT",
      dateFrom: "2026-03-01",
      dateTo: "2026-03-31",
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      price: 350000,
      airline: "대한항공",
      flyFrom: "ICN",
      flyTo: "NRT",
      departureDate: "2026-03-01 10:00",
      returnDate: undefined,
      bookingUrl: "https://www.google.com/travel/flights?q=ICN+to+NRT",
      duration: {
        departure: 150,
        return: undefined,
      },
    });
  });

  it("빈 결과를 빈 배열로 반환한다", async () => {
    mockSearchFlights.mockResolvedValueOnce({
      search_metadata: { status: "Success" },
      best_flights: [],
      other_flights: [],
    });

    const results = await searchFlightsNormalized({
      flyFrom: "ICN",
      flyTo: "XYZ",
      dateFrom: "2026-03-01",
      dateTo: "2026-03-31",
    });

    expect(results).toEqual([]);
  });

  it("best_flights와 other_flights를 합쳐서 반환한다", async () => {
    mockSearchFlights.mockResolvedValueOnce({
      search_metadata: { status: "Success" },
      best_flights: [
        {
          flights: [
            {
              departure_airport: { name: "인천", id: "ICN", time: "2026-03-01 10:00" },
              arrival_airport: { name: "나리타", id: "NRT", time: "2026-03-01 12:30" },
              duration: 150,
              airplane: "A321",
              airline: "대한항공",
              airline_logo: "",
              flight_number: "KE 705",
              travel_class: "Economy",
              legroom: "",
              extensions: [],
            },
          ],
          total_duration: 150,
          price: 350000,
          type: "Round trip",
          airline_logo: "",
        },
      ],
      other_flights: [
        {
          flights: [
            {
              departure_airport: { name: "인천", id: "ICN", time: "2026-03-01 14:00" },
              arrival_airport: { name: "나리타", id: "NRT", time: "2026-03-01 16:30" },
              duration: 150,
              airplane: "B737",
              airline: "제주항공",
              airline_logo: "",
              flight_number: "7C 1101",
              travel_class: "Economy",
              legroom: "",
              extensions: [],
            },
          ],
          total_duration: 150,
          price: 200000,
          type: "Round trip",
          airline_logo: "",
        },
      ],
    });

    const results = await searchFlightsNormalized({
      flyFrom: "ICN",
      flyTo: "NRT",
      dateFrom: "2026-03-01",
      dateTo: "2026-03-31",
      flightType: "round",
    });

    expect(results).toHaveLength(2);
    expect(results[0].price).toBe(350000);
    expect(results[1].price).toBe(200000);
    expect(results[1].airline).toBe("제주항공");
  });
});
