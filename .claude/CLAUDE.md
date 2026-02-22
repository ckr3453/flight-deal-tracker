# Flight Deal Tracker - 프로젝트 컨텍스트

## 개요
한국 여행자를 위한 항공권 핫딜 알림 시스템.
- 여행 조건(지역, 인원, 편도/왕복, n박n일) 입력 → 주기적 모니터링 → 저렴한 가격 감지 시 이메일 알림
- UI: 미니멀 단일 페이지 (조건 입력 폼 + 내 알림 목록만)
- 관리자: 가입 승인/거부 처리 페이지 (`/admin`)

## 배포 현황
- **호스팅**: Vercel
- **DB**: Turso (프로덕션) / SQLite (로컬)
- **상태**: 배포 완료, Tequila API 키 미발급 (항공편 검색 미동작)

## 기술 스택
| 영역 | 선택 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, TypeScript) |
| 스타일링 | Tailwind CSS v4 |
| DB | Turso (프로덕션) / SQLite + better-sqlite3 (로컬) + Prisma 7 |
| 항공권 API | Tequila by Kiwi.com |
| 이메일 | Resend + react-email |
| 인증 | NextAuth.js v5 (Google OAuth) |
| 스케줄링 | Vercel Cron (1일 1회) + GitHub Actions (6시간마다) |
| 배포 | Vercel |
| 테스트 | Vitest + Testing Library (72개 테스트) |

## 데이터 모델
- **User**: NextAuth 사용자 (role: admin/user, isApproved)
- **Monitor**: 모니터링 조건 (출발지, 목적지, 인원, 기간, 희망가격)
- **PriceRecord**: 가격 이력 (모니터별 시점별 최저/평균/최고가)
- **Deal**: 감지된 핫딜 (price_drop, under_target, all_time_low)
- **Notification**: 알림 발송 로그 (24시간 중복 방지용)

## 핫딜 감지 알고리즘 (3가지 기준, 하나라도 충족 시 알림)
1. **가격 하락**: 최근 7일 평균 대비 15% 이상 하락 (이력 3건 이상)
2. **목표 가격 이하**: 사용자 설정 maxPrice 이하
3. **역대 최저가**: 전체 이력 중 최저가 갱신 (이력 5건 이상)

## Prisma 7 주의사항
- PrismaClient에 반드시 어댑터 필요: `@prisma/adapter-libsql` (Turso), `@prisma/adapter-better-sqlite3` (로컬)
- `prisma db push`는 libsql URL 직접 지원 안 함 → `scripts/turso-push.mjs`로 스키마 적용
- `prisma.config.ts`에서 libsql일 때 더미 datasource URL 사용, migrate.adapter로 실제 연결

## 로컬 개발
```bash
npm install
npx prisma db push          # 로컬 SQLite 스키마 적용
npm run dev                  # http://localhost:3000
```
첫 로그인 후 관리자 승격:
```bash
npx prisma db execute --stdin <<'SQL'
UPDATE User SET role = 'admin', isApproved = 1 WHERE id = (SELECT id FROM User LIMIT 1);
SQL
```

## Turso 스키마 적용 (프로덕션)
```bash
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="..." node scripts/turso-push.mjs
```

## 환경변수
```
DATABASE_URL=          # Turso: libsql://... / 로컬: file:./prisma/dev.db
TURSO_AUTH_TOKEN=      # Turso 인증 토큰 (프로덕션만)
TEQUILA_API_KEY=       # Tequila (Kiwi.com) API 키
RESEND_API_KEY=        # Resend 이메일 API 키
CRON_SECRET=           # Cron 인증 시크릿
NEXTAUTH_SECRET=       # NextAuth 시크릿
AUTH_GOOGLE_ID=        # Google OAuth Client ID
AUTH_GOOGLE_SECRET=    # Google OAuth Client Secret
```

## 개발 원칙
- **TDD**: 서비스 로직, 비즈니스 규칙, 데이터 레이어, 유틸리티는 테스트 먼저 작성
- **TDD 선택**: UI 컴포넌트, 단순 CRUD는 구현 후 테스트 허용
- **단순 설계**: Make it work → make it right → make it fast
- **작은 단계**: 한 번에 하나의 동작만 변경, 각 단계마다 테스트 통과 확인
