# Deal Detector 서비스 (핵심)

- phase: 4
- size: M
- blocked_by: 008-price-tracker, 002-price-utils

## 목표
`src/lib/services/deal-detector.ts` - 핫딜 감지 알고리즘

## 완료 기준
- [ ] 가격 하락 감지: 7일 평균 대비 15%↓ (이력 3건+)
- [ ] 목표 가격 이하: maxPrice 이하 발견
- [ ] 역대 최저가: 전체 이력 최저 갱신 (이력 5건+)
- [ ] 24시간 중복 알림 방지
- [ ] 단위 테스트 통과 (모든 시나리오)
