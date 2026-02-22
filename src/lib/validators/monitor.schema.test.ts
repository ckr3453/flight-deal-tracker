import { describe, it, expect } from "vitest";
import { createMonitorSchema, updateMonitorSchema } from "./monitor.schema";

describe("createMonitorSchema", () => {
  it("유효한 왕복 모니터를 통과시킨다", () => {
    const input = {
      flyFrom: "ICN",
      flyTo: "NRT",
      flightType: "round" as const,
      adults: 2,
      children: 0,
      infants: 0,
      nightsFrom: 5,
      nightsTo: 7,
      maxPrice: 500000,
    };
    const result = createMonitorSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("유효한 편도 모니터를 통과시킨다", () => {
    const input = {
      flyFrom: "ICN",
      flyTo: "BKK",
      flightType: "oneway" as const,
      adults: 1,
      children: 0,
      infants: 0,
    };
    const result = createMonitorSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("필수 필드 누락 시 실패한다", () => {
    const input = { flyFrom: "ICN" };
    const result = createMonitorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("잘못된 공항 코드를 거부한다 (소문자)", () => {
    const input = {
      flyFrom: "icn",
      flyTo: "NRT",
      flightType: "round" as const,
      adults: 1,
      children: 0,
      infants: 0,
      nightsFrom: 3,
      nightsTo: 5,
    };
    const result = createMonitorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("잘못된 공항 코드를 거부한다 (4글자)", () => {
    const input = {
      flyFrom: "ICNN",
      flyTo: "NRT",
      flightType: "round" as const,
      adults: 1,
      children: 0,
      infants: 0,
      nightsFrom: 3,
      nightsTo: 5,
    };
    const result = createMonitorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("adults 범위 초과를 거부한다 (10명)", () => {
    const input = {
      flyFrom: "ICN",
      flyTo: "NRT",
      flightType: "oneway" as const,
      adults: 10,
      children: 0,
      infants: 0,
    };
    const result = createMonitorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("maxPrice 범위 미달을 거부한다 (49999)", () => {
    const input = {
      flyFrom: "ICN",
      flyTo: "NRT",
      flightType: "oneway" as const,
      adults: 1,
      children: 0,
      infants: 0,
      maxPrice: 49999,
    };
    const result = createMonitorSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("maxPrice 없이도 통과한다 (선택)", () => {
    const input = {
      flyFrom: "ICN",
      flyTo: "NRT",
      flightType: "oneway" as const,
      adults: 1,
      children: 0,
      infants: 0,
    };
    const result = createMonitorSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});

describe("updateMonitorSchema", () => {
  it("부분 업데이트를 허용한다", () => {
    const result = updateMonitorSchema.safeParse({ maxPrice: 300000 });
    expect(result.success).toBe(true);
  });

  it("빈 객체도 허용한다", () => {
    const result = updateMonitorSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("잘못된 값은 거부한다", () => {
    const result = updateMonitorSchema.safeParse({ adults: 0 });
    expect(result.success).toBe(false);
  });
});
