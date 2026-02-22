export interface FlightResult {
  price: number; // KRW
  airline: string;
  flyFrom: string;
  flyTo: string;
  departureDate: string; // ISO
  returnDate?: string; // ISO (왕복)
  bookingUrl: string;
  duration: {
    departure: number; // 분
    return?: number; // 분
  };
}
