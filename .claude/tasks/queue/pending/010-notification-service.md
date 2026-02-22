# Notification 서비스

- phase: 4
- size: S
- blocked_by: 009-deal-detector

## 목표
`src/lib/services/notification.service.ts` - 이메일 발송 + 중복 방지

## 완료 기준
- [ ] `sendDealNotification()` - 딜 발견 시 이메일 발송
- [ ] `hasRecentNotification()` - 24시간 이내 동일 유형 체크
- [ ] 단위 테스트 통과
