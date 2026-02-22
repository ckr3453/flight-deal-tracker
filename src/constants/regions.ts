export interface Region {
  code: string; // IATA 도시/공항 코드
  nameKo: string;
  nameEn: string;
  country: string;
}

export const POPULAR_REGIONS: Region[] = [
  // 일본
  { code: "TYO", nameKo: "도쿄", nameEn: "Tokyo", country: "JP" },
  { code: "OSA", nameKo: "오사카", nameEn: "Osaka", country: "JP" },
  { code: "FUK", nameKo: "후쿠오카", nameEn: "Fukuoka", country: "JP" },
  { code: "OKA", nameKo: "오키나와", nameEn: "Okinawa", country: "JP" },
  { code: "CTS", nameKo: "삿포로", nameEn: "Sapporo", country: "JP" },
  // 동남아
  { code: "BKK", nameKo: "방콕", nameEn: "Bangkok", country: "TH" },
  { code: "CNX", nameKo: "치앙마이", nameEn: "Chiang Mai", country: "TH" },
  { code: "HKT", nameKo: "푸켓", nameEn: "Phuket", country: "TH" },
  { code: "HAN", nameKo: "하노이", nameEn: "Hanoi", country: "VN" },
  { code: "SGN", nameKo: "호치민", nameEn: "Ho Chi Minh", country: "VN" },
  { code: "DAD", nameKo: "다낭", nameEn: "Da Nang", country: "VN" },
  { code: "MNL", nameKo: "마닐라", nameEn: "Manila", country: "PH" },
  { code: "CEB", nameKo: "세부", nameEn: "Cebu", country: "PH" },
  { code: "SIN", nameKo: "싱가포르", nameEn: "Singapore", country: "SG" },
  { code: "KUL", nameKo: "쿠알라룸푸르", nameEn: "Kuala Lumpur", country: "MY" },
  { code: "BKI", nameKo: "코타키나발루", nameEn: "Kota Kinabalu", country: "MY" },
  { code: "DPS", nameKo: "발리", nameEn: "Bali", country: "ID" },
  { code: "REP", nameKo: "씨엠립", nameEn: "Siem Reap", country: "KH" },
  // 중화권
  { code: "HKG", nameKo: "홍콩", nameEn: "Hong Kong", country: "HK" },
  { code: "MFM", nameKo: "마카오", nameEn: "Macau", country: "MO" },
  { code: "TPE", nameKo: "타이베이", nameEn: "Taipei", country: "TW" },
  { code: "PVG", nameKo: "상하이", nameEn: "Shanghai", country: "CN" },
  { code: "PEK", nameKo: "베이징", nameEn: "Beijing", country: "CN" },
  // 미주/태평양
  { code: "GUM", nameKo: "괌", nameEn: "Guam", country: "US" },
  { code: "SPN", nameKo: "사이판", nameEn: "Saipan", country: "US" },
  { code: "HNL", nameKo: "호놀룰루", nameEn: "Honolulu", country: "US" },
  { code: "LAX", nameKo: "로스앤젤레스", nameEn: "Los Angeles", country: "US" },
  { code: "JFK", nameKo: "뉴욕", nameEn: "New York", country: "US" },
  { code: "SYD", nameKo: "시드니", nameEn: "Sydney", country: "AU" },
  // 유럽
  { code: "CDG", nameKo: "파리", nameEn: "Paris", country: "FR" },
  { code: "LHR", nameKo: "런던", nameEn: "London", country: "GB" },
  { code: "FRA", nameKo: "프랑크푸르트", nameEn: "Frankfurt", country: "DE" },
  { code: "FCO", nameKo: "로마", nameEn: "Rome", country: "IT" },
  { code: "BCN", nameKo: "바르셀로나", nameEn: "Barcelona", country: "ES" },
  { code: "PRG", nameKo: "프라하", nameEn: "Prague", country: "CZ" },
  { code: "ZRH", nameKo: "취리히", nameEn: "Zurich", country: "CH" },
  { code: "IST", nameKo: "이스탄불", nameEn: "Istanbul", country: "TR" },
];
