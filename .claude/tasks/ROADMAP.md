# Flight Deal Tracker - 구현 로드맵

## Phase 0: 프로젝트 셋업
✅ 완료
- [x] GitHub 레포지토리 생성 + 연결
- [x] task-manager Phase/Task 등록

**상태**: 완료

---

## Phase 1: 프로젝트 초기화 + DB
✅ 완료
- [x] Next.js 15 프로젝트 생성 (TypeScript, Tailwind, App Router)
- [x] Prisma 7 + SQLite 스키마 설계
- [x] NextAuth.js v5 설정 (Google OAuth)
- [x] Vitest + Testing Library 설정
- [x] 타입 정의 (monitor, flight, deal, tequila)
- [x] 한국 공항 상수 정의

**상태**: 완료

---

## Phase 2: 유틸리티 + 유효성 검증 (TDD)
✅ 완료
- [x] `src/lib/utils/date.ts` - n박n일→날짜 변환, Tequila용 DD/MM/YYYY 포맷
- [x] `src/lib/utils/price.ts` - KRW 포맷, 하락률 계산
- [x] `src/lib/validators/monitor.schema.ts` - zod 스키마
- [x] `src/constants/regions.ts` - 인기 지역

**방식**: TDD (테스트 먼저)
**태스크**: #001, #002, #003, #004

---

## Phase 3: Tequila API 클라이언트 (TDD)
✅ 완료
- [x] `src/lib/api/tequila.ts` - 검색, 위치 조회, rate limiter, 재시도
- [x] `src/lib/api/flight-search.ts` - 통합 검색 (Tequila → fallback)

**방식**: TDD (fetch mock, 에러 처리)
**태스크**: #005, #006

---

## Phase 4: 서비스 레이어 (TDD)
✅ 완료
- [x] `src/lib/services/monitor.service.ts` - 모니터 CRUD
- [x] `src/lib/services/price-tracker.ts` - 가격 기록, 7일/전체 이력
- [x] `src/lib/services/deal-detector.ts` - **핫딜 감지 알고리즘** (핵심)
- [x] `src/lib/services/notification.service.ts` - 이메일 발송 + 중복 방지

**방식**: TDD (단위 테스트)
**태스크**: #007, #008, #009, #010

---

## Phase 5: 이메일 템플릿 + API Routes
✅ 완료
- [x] `src/lib/email/templates/deal-alert.tsx` - react-email
- [x] `src/lib/email/send.ts` - Resend 래핑
- [x] `src/app/api/monitors/route.ts` - GET (목록), POST (생성)
- [x] `src/app/api/monitors/[id]/route.ts` - PUT, DELETE
- [x] `src/app/api/search/route.ts` - 수동 검색
- [x] `src/app/api/cron/monitor/route.ts` - Cron 핸들러

**태스크**: #011

---

## Phase 6: UI 구현
✅ 완료

### 사용자 페이지
- [x] `src/app/page.tsx` - 메인 (미승인: 대기 메시지)
- [x] `src/app/layout.tsx` - 루트 (`<html lang="ko">`)
- [x] `src/components/monitors/monitor-form.tsx` - 조건 입력 폼
- [x] `src/components/monitors/monitor-list.tsx` - 목록 (활성/일시정지/삭제)
- [x] `src/components/monitors/monitor-card.tsx` - 카드

### 관리자 페이지
- [x] `src/app/admin/page.tsx` - 대시보드
- [x] `src/app/admin/layout.tsx` - 관리자 인증
- [x] `src/app/api/admin/users/route.ts` - GET
- [x] `src/app/api/admin/users/[id]/approve/route.ts` - POST (승인/거부)

**태스크**: #012, #013

---

## Phase 7: 배포 설정 (Vercel + Cron)
✅ 완료
- [x] `vercel.json` - Cron 설정 (1일 1회)
- [x] `.github/workflows/monitor.yml` - GitHub Actions (6시간마다)
- [x] `.env.example` 환경변수 문서화

**태스크**: #014

---

## 추가 검증 단계
- **단위 테스트**: `npm test`로 전체 통과
- **수동 E2E**: 모니터 생성 → 검색 → 딜 감지 → 이메일
- **Cron 테스트**: `/api/cron/monitor` 직접 호출 → 파이프라인 동작 확인
