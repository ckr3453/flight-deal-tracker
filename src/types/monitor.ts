export type FlightType = "round" | "oneway";
export type MonitorStatus = "active" | "paused";

export interface MonitorInput {
  flyFrom: string;
  flyTo: string;
  flightType: FlightType;
  adults: number;
  children: number;
  infants: number;
  nightsFrom?: number;
  nightsTo?: number;
  dateFrom?: string; // DD/MM/YYYY
  dateTo?: string; // DD/MM/YYYY
  maxPrice?: number;
}
