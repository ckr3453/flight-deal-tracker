# Monitor 서비스

- phase: 4
- size: M
- blocked_by: 003-monitor-schema

## 목표
`src/lib/services/monitor.service.ts` - 모니터 CRUD + 활성 모니터 조회

## 완료 기준
- [ ] `createMonitor()`, `updateMonitor()`, `deleteMonitor()`
- [ ] `getMonitorsByUser()`, `getActiveMonitors()`
- [ ] `toggleMonitorStatus()` (active ↔ paused)
- [ ] 단위 테스트 통과
