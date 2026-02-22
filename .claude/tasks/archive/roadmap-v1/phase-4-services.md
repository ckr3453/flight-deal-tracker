# Phase 4: 서비스 레이어 (TDD)

완료일: 2026-02-22

## 포함 태스크
- 007-monitor-service: Monitor CRUD (createMonitor, updateMonitor, deleteMonitor, getMonitorsByUser, getActiveMonitors, toggleMonitorStatus)
- 008-price-tracker: 가격 이력 (recordPrice, getRecentPrices, getAllPrices)
- 009-deal-detector: 핫딜 감지 알고리즘 (가격 하락 15%, 목표 가격 이하, 역대 최저가, 24시간 중복 방지)
- 010-notification-service: 이메일 발송 (sendDealNotification, hasRecentNotification) + Resend 래핑
