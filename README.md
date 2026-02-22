# Flight Deal Tracker

한국 여행자를 위한 항공권 핫딜 알림 서비스. 여행 조건을 등록하면 주기적으로 항공권 가격을 모니터링하고, 저렴한 가격이 감지되면 이메일로 알림을 보내줍니다.

## 주요 기능

- **모니터 등록** — 출발지/목적지, 인원, 편도·왕복, 숙박일수, 희망가격 설정
- **자동 가격 추적** — Cron으로 주기적 항공편 검색 및 가격 이력 기록
- **핫딜 감지** — 3가지 알고리즘으로 저렴한 항공편 자동 감지
  - 최근 7일 평균 대비 15% 이상 하락
  - 사용자 설정 목표 가격 이하
  - 역대 최저가 갱신
- **이메일 알림** — 핫딜 감지 시 즉시 이메일 발송 (24시간 중복 방지)
- **관리자 승인** — 신규 가입자는 관리자 승인 후 서비스 이용 가능

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, TypeScript) |
| 스타일링 | Tailwind CSS v4 |
| DB | Turso (프로덕션) / SQLite (로컬) + Prisma 7 |
| 항공권 API | SerpApi (Google Flights) |
| 이메일 | Resend + react-email |
| 인증 | NextAuth.js v5 (Google OAuth) |
| 스케줄링 | Vercel Cron + GitHub Actions |
| 테스트 | Vitest + Testing Library |

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm

### 설치

```bash
git clone https://github.com/ckr3453/flight-deal-tracker.git
cd flight-deal-tracker
npm install
```

### 환경변수 설정

`.env.example`을 복사하여 `.env.local`을 만들고 값을 채워주세요.

```bash
cp .env.example .env.local
```

| 변수 | 설명 | 발급처 |
|------|------|--------|
| `DATABASE_URL` | DB URL (로컬: `file:./prisma/dev.db`) | — |
| `TURSO_AUTH_TOKEN` | Turso 인증 토큰 (프로덕션) | [Turso](https://turso.tech) |
| `SERPAPI_API_KEY` | 항공편 검색 API 키 (Google Flights) | [SerpApi](https://serpapi.com) |
| `RESEND_API_KEY` | 이메일 발송 API 키 | [Resend](https://resend.com) |
| `CRON_SECRET` | Cron 엔드포인트 인증용 시크릿 | 임의 생성 |
| `NEXTAUTH_SECRET` | NextAuth 세션 암호화 시크릿 | 임의 생성 |
| `NEXTAUTH_URL` | 앱 URL | `http://localhost:3000` |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com) |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret | Google Cloud Console |

### DB 초기화 및 실행

```bash
npx prisma db push    # DB 스키마 적용
npm run dev           # 개발 서버 실행 (http://localhost:3000)
```

### 첫 번째 관리자 설정

Google 로그인 후 "관리자 승인 대기" 화면이 나타나면, DB에서 직접 관리자로 승격합니다.

```bash
npx prisma db execute --stdin <<'SQL'
UPDATE User SET role = 'admin', isApproved = 1 WHERE id = (SELECT id FROM User LIMIT 1);
SQL
```

이후 `/admin`에서 다른 사용자를 승인할 수 있습니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run test` | 테스트 실행 (watch 모드) |
| `npm run test:run` | 테스트 1회 실행 |
| `npm run verify` | 타입체크 + 린트 + 포맷 + 테스트 전체 검증 |
| `npm run lint` | ESLint 검사 |
| `npm run format` | Prettier 포맷팅 |
| `npx prisma studio` | DB GUI |

## 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── admin/users/       # 관리자 API (사용자 목록, 승인/거부)
│   │   ├── cron/monitor/      # Cron 핸들러 (가격 추적 파이프라인)
│   │   ├── monitors/          # 모니터 CRUD API
│   │   └── search/            # 수동 항공편 검색 API
│   ├── admin/                 # 관리자 페이지
│   └── page.tsx               # 메인 페이지
├── components/
│   ├── admin/                 # 관리자 대시보드
│   ├── auth/                  # 세션 프로바이더
│   ├── monitors/              # 모니터 폼, 목록, 카드
│   └── ui/                    # 공통 UI 컴포넌트
├── constants/                 # 공항, 지역 상수
├── lib/
│   ├── api/                   # SerpApi (Google Flights) 클라이언트
│   ├── email/                 # Resend 래퍼 + react-email 템플릿
│   ├── services/              # 비즈니스 로직 (모니터, 가격추적, 딜감지, 알림)
│   ├── utils/                 # 날짜, 가격 유틸리티
│   └── validators/            # Zod 스키마
└── types/                     # TypeScript 타입 정의
```

## 배포

Vercel에 배포하고 환경변수를 설정하면 됩니다.

- **Vercel Cron**: 매일 09:00 UTC에 `/api/cron/monitor` 실행
- **GitHub Actions**: 6시간마다 `/api/cron/monitor` 호출 (보조)

## 라이선스

MIT
