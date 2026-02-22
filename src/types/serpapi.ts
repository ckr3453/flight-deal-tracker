export interface SerpApiSearchParams {
  departure_id: string;
  arrival_id: string;
  outbound_date: string; // YYYY-MM-DD
  return_date?: string; // YYYY-MM-DD (왕복)
  type: 1 | 2; // 1=왕복, 2=편도
  adults?: number;
  children?: number;
  infants_in_seat?: number;
  currency?: string;
  hl?: string;
  gl?: string;
}

export interface SerpApiAirport {
  name: string;
  id: string;
  time: string; // "YYYY-MM-DD HH:MM"
}

export interface SerpApiFlight {
  departure_airport: SerpApiAirport;
  arrival_airport: SerpApiAirport;
  duration: number; // 분
  airplane: string;
  airline: string;
  airline_logo: string;
  flight_number: string;
  travel_class: string;
  legroom: string;
  extensions: string[];
}

export interface SerpApiFlightResult {
  flights: SerpApiFlight[];
  layovers?: {
    duration: number;
    name: string;
    id: string;
  }[];
  total_duration: number; // 분
  price: number;
  type: string;
  airline_logo: string;
  departure_token?: string;
}

export interface SerpApiSearchResponse {
  search_metadata: {
    status: string;
  };
  best_flights?: SerpApiFlightResult[];
  other_flights?: SerpApiFlightResult[];
  price_insights?: {
    lowest_price: number;
    typical_price_range: [number, number];
  };
  error?: string;
}
