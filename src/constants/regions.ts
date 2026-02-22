export interface Region {
  code: string; // IATA 도시/공항 코드
  nameKo: string;
  nameEn: string;
  country: string;
}

export const POPULAR_REGIONS: Region[] = [
  { code: "TYO", nameKo: "도쿄", nameEn: "Tokyo", country: "JP" },
  { code: "OSA", nameKo: "오사카", nameEn: "Osaka", country: "JP" },
  { code: "FUK", nameKo: "후쿠오카", nameEn: "Fukuoka", country: "JP" },
  { code: "OKA", nameKo: "오키나와", nameEn: "Okinawa", country: "JP" },
  { code: "BKK", nameKo: "방콕", nameEn: "Bangkok", country: "TH" },
  { code: "HKG", nameKo: "홍콩", nameEn: "Hong Kong", country: "HK" },
  { code: "SIN", nameKo: "싱가포르", nameEn: "Singapore", country: "SG" },
  { code: "TPE", nameKo: "타이베이", nameEn: "Taipei", country: "TW" },
  { code: "HAN", nameKo: "하노이", nameEn: "Hanoi", country: "VN" },
  { code: "SGN", nameKo: "호치민", nameEn: "Ho Chi Minh", country: "VN" },
  { code: "DAD", nameKo: "다낭", nameEn: "Da Nang", country: "VN" },
  { code: "MNL", nameKo: "마닐라", nameEn: "Manila", country: "PH" },
  { code: "CEB", nameKo: "세부", nameEn: "Cebu", country: "PH" },
  { code: "GUM", nameKo: "괌", nameEn: "Guam", country: "US" },
  { code: "HNL", nameKo: "호놀룰루", nameEn: "Honolulu", country: "US" },
  { code: "LAX", nameKo: "로스앤젤레스", nameEn: "Los Angeles", country: "US" },
  { code: "JFK", nameKo: "뉴욕", nameEn: "New York", country: "US" },
  { code: "CDG", nameKo: "파리", nameEn: "Paris", country: "FR" },
  { code: "LHR", nameKo: "런던", nameEn: "London", country: "GB" },
  { code: "FRA", nameKo: "프랑크푸르트", nameEn: "Frankfurt", country: "DE" },
];
