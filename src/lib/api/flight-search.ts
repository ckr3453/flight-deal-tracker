import type { FlightResult } from "@/types/flight";
import type { SerpApiFlightResult } from "@/types/serpapi";
import { searchFlights } from "./serpapi";

interface SearchParams {
  flyFrom: string;
  flyTo: string;
  dateFrom: string; // YYYY-MM-DD
  dateTo: string; // YYYY-MM-DD
  flightType?: "round" | "oneway";
  nightsFrom?: number;
  nightsTo?: number;
  adults?: number;
  children?: number;
  infants?: number;
}

function normalizeFlightResult(
  flight: SerpApiFlightResult,
  flyFrom: string,
  flyTo: string
): FlightResult {
  const firstLeg = flight.flights[0];
  const lastLeg = flight.flights[flight.flights.length - 1];

  return {
    price: flight.price,
    airline: firstLeg.airline,
    flyFrom: firstLeg.departure_airport.id || flyFrom,
    flyTo: lastLeg.arrival_airport.id || flyTo,
    departureDate: firstLeg.departure_airport.time,
    returnDate: undefined, // 왕복 귀국편은 별도 요청 필요
    bookingUrl: `https://www.google.com/travel/flights?q=${flyFrom}+to+${flyTo}`,
    duration: {
      departure: flight.total_duration,
      return: undefined,
    },
  };
}

export async function searchFlightsNormalized(params: SearchParams): Promise<FlightResult[]> {
  const isRoundTrip = params.flightType !== "oneway";

  // SerpApi Google Flights는 특정 날짜로 검색
  // dateFrom을 출발일로 사용
  const response = await searchFlights({
    departure_id: params.flyFrom,
    arrival_id: params.flyTo,
    outbound_date: params.dateFrom,
    return_date: isRoundTrip ? params.dateTo : undefined,
    type: isRoundTrip ? 1 : 2,
    adults: params.adults,
    children: params.children,
    infants_in_seat: params.infants,
  });

  if (response.error) {
    throw new Error(`Google Flights 검색 오류: ${response.error}`);
  }

  const allFlights = [...(response.best_flights ?? []), ...(response.other_flights ?? [])];

  return allFlights.map((f) => normalizeFlightResult(f, params.flyFrom, params.flyTo));
}
