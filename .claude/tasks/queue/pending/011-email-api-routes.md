# 이메일 템플릿 + API Routes

- phase: 5
- size: L
- blocked_by: 010-notification-service

## 목표
이메일 템플릿, Resend 래핑, monitors/search/cron API routes 구현

## 완료 기준
- [ ] react-email 핫딜 알림 템플릿
- [ ] Resend 이메일 발송 함수
- [ ] POST /api/monitors (생성), GET /api/monitors (목록)
- [ ] PUT /api/monitors/[id] (수정/토글), DELETE /api/monitors/[id]
- [ ] POST /api/search (수동 즉시 검색)
- [ ] GET /api/cron/monitor (Cron 핸들러, CRON_SECRET 인증)
