export interface TequilaSearchParams {
  fly_from: string;
  fly_to: string;
  date_from: string; // DD/MM/YYYY
  date_to: string; // DD/MM/YYYY
  flight_type?: "round" | "oneway";
  nights_in_dst_from?: number;
  nights_in_dst_to?: number;
  adults?: number;
  children?: number;
  infants?: number;
  curr?: string;
  sort?: string;
  limit?: number;
  locale?: string;
}

export interface TequilaRoute {
  flyFrom: string;
  flyTo: string;
  cityFrom: string;
  cityTo: string;
  local_departure: string;
  local_arrival: string;
  airline: string;
}

export interface TequilaFlight {
  id: string;
  price: number;
  airlines: string[];
  route: TequilaRoute[];
  deep_link: string;
  fly_duration: string;
  return_duration?: string;
  local_departure: string;
  local_arrival: string;
  utc_departure: string;
  utc_arrival: string;
}

export interface TequilaSearchResponse {
  search_id: string;
  data: TequilaFlight[];
  currency: string;
}

export interface TequilaLocationResult {
  id: string;
  int_id: number;
  code: string;
  name: string;
  city: {
    id: string;
    name: string;
    code: string;
    country: {
      id: string;
      name: string;
      code: string;
    };
  };
  type: string;
}

export interface TequilaLocationResponse {
  locations: TequilaLocationResult[];
}
