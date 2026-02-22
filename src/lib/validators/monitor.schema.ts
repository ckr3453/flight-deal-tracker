import { z } from "zod/v4";

const airportCode = z.string().regex(/^[A-Z]{3}$/, "3글자 대문자 공항 코드를 입력하세요");

export const createMonitorSchema = z.object({
  flyFrom: airportCode,
  flyTo: airportCode,
  flightType: z.enum(["round", "oneway"]),
  adults: z.number().int().min(1, "최소 1명").max(9, "최대 9명"),
  children: z.number().int().min(0).max(3, "최대 3명"),
  infants: z.number().int().min(0).max(3, "최대 3명"),
  nightsFrom: z.number().int().min(1).max(30).optional(),
  nightsTo: z.number().int().min(1).max(30).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  maxPrice: z.number().int().min(50000, "최소 ₩50,000").max(5000000, "최대 ₩5,000,000").optional(),
});

export const updateMonitorSchema = createMonitorSchema.partial();

export type CreateMonitorInput = z.infer<typeof createMonitorSchema>;
export type UpdateMonitorInput = z.infer<typeof updateMonitorSchema>;
