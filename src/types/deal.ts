export type DealType = "price_drop" | "under_target" | "all_time_low";

export interface DetectedDeal {
  monitorId: string;
  price: number;
  dropRate?: number;
  dealType: DealType;
  airline?: string;
  bookingUrl?: string;
}
