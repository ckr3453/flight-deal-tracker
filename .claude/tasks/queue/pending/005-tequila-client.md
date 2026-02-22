# Tequila API 클라이언트

- phase: 3
- size: M
- blocked_by: 001-date-utils

## 목표
`src/lib/api/tequila.ts` - 항공편 검색, 위치 검색, rate limiter, 재시도

## 완료 기준
- [ ] `searchFlights()` - GET /v2/search 호출
- [ ] `searchLocations()` - 위치 자동완성
- [ ] rate limiter (일 100회)
- [ ] 지수 백오프 재시도 (429, 5xx)
- [ ] 단위 테스트 통과 (fetch mock)
