export interface Airport {
  code: string;
  name: string;
  city: string;
}

export const KOREAN_AIRPORTS: Airport[] = [
  { code: "ICN", name: "인천국제공항", city: "서울/인천" },
  { code: "GMP", name: "김포국제공항", city: "서울" },
  { code: "PUS", name: "김해국제공항", city: "부산" },
  { code: "CJU", name: "제주국제공항", city: "제주" },
  { code: "TAE", name: "대구국제공항", city: "대구" },
  { code: "CJJ", name: "청주국제공항", city: "청주" },
  { code: "MWX", name: "무안국제공항", city: "무안" },
  { code: "KWJ", name: "광주공항", city: "광주" },
  { code: "RSU", name: "여수공항", city: "여수" },
  { code: "USN", name: "울산공항", city: "울산" },
];
