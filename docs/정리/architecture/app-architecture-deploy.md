# 앱 배포 대비 아키텍처 설계(접근성·보안·데이터)

프로젝트: Second Semester — 학기 진행 대시보드
배포 목표: 실사용 가능한 웹앱(설치형 PWA까지 확장 가능)

---

## 1) 목표와 원칙
- 최소 권한, 보안 기본값, 개인정보 최소 수집(Privacy by default)
- 접근성 우선: 키보드, 스크린리더, 명확한 대비, 의미론적 마크업
- 서버/클라이언트 일관성(SSR 안전), 안정적인 Fast Refresh/빌드
- 확장성과 이식성: 환경 분리(dev/staging/prod), IaC/CI 구성

---

## 2) 환경/배포 전략
- 호스팅: Vercel(권장, Next.js 친화) 또는 Netlify/Cloudflare Pages
- 환경 분리: dev(미리보기 URL), prod(커스텀 도메인)
- 시크릿: 환경 변수(.env.local, Vercel Project Env), Git에 절대 커밋 금지
- 도메인/HTTPS: 자동 TLS, HSTS 사용(보안 헤더 설정 참고)

---

## 3) 인증/권한 설계
- 선택지 A) Auth.js(NextAuth) + OAuth/Email link
- 선택지 B) Supabase Auth(소셜/OAuth, RLS와 연계 용이)
- 세션 관리: JWT 또는 DB 세션(만료/갱신 정책 명확화)
- 권한: 최소 권한(Role, Row Level Security) 기반으로 읽기/쓰기 분리
- 민감 데이터는 서버 액션/Route Handler에서만 처리(클라이언트에 노출 금지)

---

## 4) 데이터 저장 전략(권장: Supabase Postgres + RLS)
- 테이블 예시
  - users(id, email, profile)
  - semesters(id, owner_id, name, start, end, progress)
  - todos(id, owner_id, title, done, due)
  - attendance(id, owner_id, date, status)
  - timeline_items(id, owner_id, start, end, tag, note)
- RLS 정책
  - 각 테이블: `owner_id = auth.uid()`인 레코드만 CRUD 허용
- 오프라인/싱크
  - 1단계: 브라우저 IndexedDB에 캐시(작업 내역 임시 저장)
  - 2단계: 온라인 시 서버와 양방향 싱크(충돌 정책: 최신 수정 우선/병합 규칙)
- 백업/복구
  - DB 자동 백업(Supabase 스냅샷/Point-in-time), 주기적 상태 점검

---

## 5) API/서버 경계
- Next.js Route Handler 또는 Server Actions로 서버 경계 확실히
- 입력 검증: zod로 스키마 검증(서버 측 필수)
- 속도·보안
  - Rate limiting(미들웨어 또는 API Gateway)
  - 캐시 헤더/Tag 기반 재검증(SWR, React Cache)

---

## 6) 보안 베이스라인
- 보안 헤더(Next.js headers 설정)
  - CSP(Content-Security-Policy): script-src, style-src(sha256/nonce), img-src, connect-src 등 최소화
  - HSTS(Strict-Transport-Security): max-age=63072000; includeSubDomains; preload
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: 카메라/마이크/지오로케이션 등 비활성화 기본
- 시크릿 관리
  - 모든 키는 환경 변수로만 사용, 런타임에 서버에서만 참조
  - 클라이언트 번들에 유출 금지(검증 스크립트/ESLint 룰 고려)
- 의존성 보안
  - 정기적 업데이트, npm audit, Renovate/GitHub Dependabot
- 파일 업로드(향후)
  - 서명된 URL 사용, 확장자/콘텐츠 타입 검증, AV 스캔 옵션 고려

---

## 7) 접근성(a11y) 전략과 체크리스트
- 의미론적 HTML 요소 사용(header, main, nav, section, h1~h6)
- 키보드 탐색: 포커스 트랩/순서, 스킵 링크 제공
- 명확한 레이블: 버튼/아이콘에 aria-label 제공
- 명도 대비: WCAG AA 이상, 다크/라이트 모두 확인
- 상태 변경 알림: ARIA Live region 사용 고려
- 폼 유효성: 에러 메시지와 연결(aria-describedby)
- 테마 불일치/수화 오류 방지: 마운트 후 렌더, suppressHydrationWarning
- 테스트: Lighthouse, axe DevTools, 스크린리더(VoiceOver) 수동 점검

---

## 8) PWA/오프라인(선택)
- manifest.json, 서비스워커(workbox) 도입
- 캐싱 전략
  - 정적 에셋: stale-while-revalidate
  - 데이터 요청: 네트워크 우선 + 백오프/리트라이
- 설치형 앱 지원(아이콘/스플래시 이미지 준비)

---

## 9) 관측성/로깅/프라이버시
- 에러 모니터링: Sentry(또는 Vercel Monitoring)
- 성능: Web Vitals 수집, LCP/CLS/FID 추적
- 프라이버시 보호 로깅
  - PII는 절대 로그에 남기지 않기
  - IP/UA 최소화 또는 익명화, 샘플링 도입

---

## 10) CI/CD 파이프라인
- Git 브랜치 전략: main/prod, develop/staging, feature/*
- 검사 단계: typecheck, lint, test, build
- 배포: main → prod 자동 배포, preview는 PR마다 생성
- 시크릿: Vercel/CI 시크릿에 저장, 권한 분리

---

## 11) 성능/최적화
- 이미지 최적화(Next/Image), 폰트 서브셋, 아이콘 트리셰이킹
- 코드 스플리팅/지연 로딩(dynamic import)
- React Server Components 적극 활용, 클라이언트 컴포넌트 최소화
- 캐시 지정(fetch 캐시 옵션, revalidate), SWR로 클라이언트 캐시

---

## 12) 법·규정 고려(간략)
- 개인정보 처리방침/이용약관 페이지
- 쿠키/스토리지 사용 고지(필요 시 동의 배너)
- 데이터 보존 기간/삭제 절차 명시

---

## 실행 체크리스트(요약)
- [ ] Vercel 프로젝트 생성, 환경 분리(dev/prod) 및 도메인 연결
- [ ] .env 설정(로컬/배포) 및 시크릿 주입
- [ ] 보안 헤더와 CSP 설정(next.config.js headers)
- [ ] 인증 선택 및 구현(Auth.js 또는 Supabase Auth)
- [ ] Supabase 스키마/RLS 정책 작성 및 마이그레이션
- [ ] 서버 경계(Route Handler/Server Actions)로 민감 처리 고정
- [ ] a11y 감사지표(Lighthouse/axe) 통과
- [ ] PWA(옵션): manifest/서비스워커/아이콘 구성
- [ ] Sentry/모니터링 설정 및 개인정보 비식별화
- [ ] CI/CD 파이프라인 구축 및 미리보기 배포 확인

---

## 기술 선택 제안(요약)
- 배포: Vercel
- 인증·DB: Supabase(Auth + Postgres + RLS)
- 로깅: Sentry
- a11y: Tailwind + shadcn/ui 가이드라인, axe 검사
- PWA: workbox(선택)

필요 시, 다음 작업을 바로 수행할 수 있습니다:
1) next.config.js에 보안 헤더/CSP 초안 추가
2) Supabase 프로젝트와 초기 스키마/RLS 스크립트 템플릿 제공
3) Auth.js 또는 Supabase Auth 중 하나 선택해 로그인 흐름 토대 구현
