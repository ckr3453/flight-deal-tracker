# 날짜 유틸리티 구현

- phase: 2
- size: S

## 목표
`src/lib/utils/date.ts` 구현 - n박n일 → 날짜 변환, Tequila용 DD/MM/YYYY 포맷

## 완료 기준
- [ ] `convertNightsToDateRange()` - n박n일 입력 → [출발일, 귀국일] 반환
- [ ] `formatDateForTequila()` - Date → "DD/MM/YYYY" 포맷
- [ ] `getRecentDaysRange()` - 최근 N일 범위 반환 (가격 비교용)
- [ ] 단위 테스트 통과 (모든 엣지 케이스)

## 테스트 케이스
```
- 오늘부터 3박4일 → 2월 22일 ~ 2월 25일
- 정확한 DD/MM/YYYY 포맷 (선행 0 포함)
- 최근 7일 범위 계산
```
