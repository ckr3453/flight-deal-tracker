import type { FlightResult } from "@/types/flight";
import type { TequilaFlight } from "@/types/tequila";
import { searchFlights } from "./tequila";

interface SearchParams {
  flyFrom: string;
  flyTo: string;
  dateFrom: string;
  dateTo: string;
  flightType?: "round" | "oneway";
  nightsFrom?: number;
  nightsTo?: number;
  adults?: number;
  children?: number;
  infants?: number;
}

function parseDuration(duration: string): number {
  const hours = duration.match(/(\d+)h/)?.[1] ?? "0";
  const minutes = duration.match(/(\d+)m/)?.[1] ?? "0";
  return parseInt(hours) * 60 + parseInt(minutes);
}

function normalizeFlightResult(flight: TequilaFlight): FlightResult {
  const returnRoute = flight.route.length > 1 ? flight.route[flight.route.length - 1] : undefined;

  return {
    price: flight.price,
    airline: flight.airlines[0],
    flyFrom: flight.route[0].flyFrom,
    flyTo: flight.route[0].flyTo,
    departureDate: flight.local_departure,
    returnDate: returnRoute?.local_departure,
    bookingUrl: flight.deep_link,
    duration: {
      departure: parseDuration(flight.fly_duration),
      return: flight.return_duration
        ? parseDuration(flight.return_duration)
        : undefined,
    },
  };
}

export async function searchFlightsNormalized(
  params: SearchParams
): Promise<FlightResult[]> {
  const response = await searchFlights({
    fly_from: params.flyFrom,
    fly_to: params.flyTo,
    date_from: params.dateFrom,
    date_to: params.dateTo,
    flight_type: params.flightType,
    nights_in_dst_from: params.nightsFrom,
    nights_in_dst_to: params.nightsTo,
    adults: params.adults,
    children: params.children,
    infants: params.infants,
  });

  return response.data.map(normalizeFlightResult);
}
