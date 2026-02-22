# Monitor 검증 스키마 (Zod)

- phase: 2
- size: S

## 목표
`src/lib/validators/monitor.schema.ts` - Zod 스키마로 모니터 입력값 검증

## 완료 기준
- [ ] `createMonitorSchema()` - 모니터 생성 시 검증
- [ ] `updateMonitorSchema()` - 부분 업데이트 검증
- [ ] 에러 메시지 한글화
- [ ] 단위 테스트 통과

## 검증 규칙
- `flyFrom`: 공항 코드 (3글자, 대문자)
- `flyTo`: 공항 코드 (3글자, 대문자)
- `flightType`: "round" | "oneway"
- `adults`: 1 이상 9 이하
- `children`: 0 이상 3 이하
- `infants`: 0 이상 3 이하
- `nightsFrom/To`: 왕복일 때만, 1 이상 30 이하
- `maxPrice`: 선택, 50000 이상 5000000 이하

## 테스트 케이스
```
- 유효한 round trip (ICN → NRT, 7박8일)
- 유효한 oneway (ICN → BKK)
- 필수 필드 누락 → 에러
- 범위 초과 → 에러
```
