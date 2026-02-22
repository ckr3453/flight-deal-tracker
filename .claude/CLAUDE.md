# Flight Deal Tracker - 프로젝트 컨텍스트

## 개요
한국 여행자를 위한 항공권 핫딜 알림 시스템.
- 여행 조건(지역, 인원, 편도/왕복, n박n일) 입력 → 주기적 모니터링 → 저렴한 가격 감지 시 이메일 알림
- UI: 미니멀 단일 페이지 (조건 입력 폼 + 내 알림 목록만)
- 관리자: 가입 승인/거부 처리 페이지

## 기술 스택
| 영역 | 선택 | 비용 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router, TypeScript) | 무료 |
| 스타일링 | Tailwind CSS v4 | 무료 |
| DB | Turso (SQLite 호환 클라우드) + Prisma ORM | 무료 |
| 항공권 API | Tequila by Kiwi.com | 무료 |
| 이메일 | Resend + react-email | 무료 (3,000통/월) |
| 인증 | NextAuth.js v5 (Google OAuth) | 무료 |
| 스케줄링 | Vercel Cron (1일 1회) + GitHub Actions (6시간마다) | 무료 |
| 배포 | Vercel | 무료 |
| 테스트 | Vitest + Testing Library | 무료 |

## 데이터 모델
- **User**: NextAuth 사용자 (role, isApproved)
- **Monitor**: 모니터링 조건 (출발지, 목적지, 인원, 기간, 희망가격)
- **PriceRecord**: 가격 이력 (모니터별 시점별)
- **Deal**: 감지된 핫딜
- **Notification**: 알림 발송 로그 (중복 방지용)

## 핫딜 감지 알고리즘 (3가지 기준, 하나라도 충족 시 알림)
1. **가격 하락**: 최근 7일 평균 대비 15% 이상 하락 (이력 3건 이상)
2. **목표 가격 이하**: 사용자 설정 maxPrice 이하
3. **역대 최저가**: 전체 이력 중 최저가 갱신 (이력 5건 이상)
- 24시간 이내 동일 유형 딜 중복 알림 방지

## GitHub
- Repo: https://github.com/ckr3453/flight-deal-tracker (public)
- Branch: main

## 개발 원칙
- **TDD**: 서비스 로직, 비즈니스 규칙, 데이터 레이어, 유틸리티는 테스트 먼저 작성
- **TDD 선택**: UI 컴포넌트, 단순 CRUD는 구현 후 테스트 허용
- **단순 설계**: Make it work → make it right → make it fast
- **작은 단계**: 한 번에 하나의 동작만 변경, 각 단계마다 테스트 통과 확인

## 환경변수 (.env)
```
DATABASE_URL=          # Turso DB URL (libsql://...)
TURSO_AUTH_TOKEN=      # Turso 인증 토큰
TEQUILA_API_KEY=       # Tequila (Kiwi.com) API 키
RESEND_API_KEY=        # Resend 이메일 API 키
CRON_SECRET=           # Cron 인증 시크릿
NEXTAUTH_SECRET=       # NextAuth 시크릿
NEXTAUTH_URL=          # 앱 URL (http://localhost:3000)
AUTH_GOOGLE_ID=        # Google OAuth Client ID
AUTH_GOOGLE_SECRET=    # Google OAuth Client Secret
```
