# Second Semester (Mock UI)

어두운 테마를 기본으로 하는 학기별 스터디 플래너 대시보드입니다. 현재는 목업 데이터로 동작하며, 페이지는 카드 컴포넌트들을 조립해 보여줍니다.

## 목적(Purpose)
- 저녁 시간대 학습을 가정한 간결한 대시보드 UI
- 진행률/할 일/출결/주간 시간표 등 핵심 정보 한눈에 보기
- 컴포넌트 분리와 클라이언트/서버 경계 최적화 연습

## 버전 기록
- 최신: [v0.1.1 컴포넌트 분리 & 정리](./docs/버전/v0.1.1.md)
- 초기: [v0.1.0 기본 레이아웃/테마](./docs/버전/v0.1.0.md)

## 사용 기술(Tech Stack)
- Next.js 14 (App Router, React 18)
- TypeScript
- Tailwind CSS, tailwind-merge, tailwindcss-animate
- shadcn 스타일의 최소 UI 컴포넌트(Card, Badge, Progress, Checkbox, Separator)
- 아이콘: lucide-react
- 유틸: date-fns, clsx, zod
- 테마: next-themes
- 품질: ESLint, TypeScript

## 설치 및 실행(Setup)
사전 요구사항
- Node.js 18+ (권장 LTS)
- npm (또는 pnpm/yarn)

설치
```bash
npm install
```

개발 서버 실행
```bash
npm run dev
```
브라우저에서 http://localhost:3000 접속

프로덕션 빌드/실행
```bash
npm run build
npm start
```

린트
```bash
npm run lint
```

환경 변수
- 현재 버전은 목업 데이터만 사용하므로 별도 환경 변수는 필요하지 않습니다.

## 프로젝트 구조(Project Structure)
- app/
  - layout.tsx: 테마 Provider + 글로벌 스타일
  - page.tsx: 대시보드 조립(레이아웃)
  - _components/
    - MainProgressCard.tsx: 진행률 + D-Day + 오늘 투두 개수
    - TodoListCard.tsx: 오늘의 투두(체크 포함)
    - AttendanceCard.tsx: 출결 현황
    - WeeklyTimelineCard.tsx: 주간 스케줄 타임라인
  - header.tsx: 상단 헤더(테마 토글)
- components/ui: 최소 UI 프리미티브(Card, Progress, Badge, Checkbox, Separator)
- components/theme-toggle.tsx: 라이트/다크 스위치
- lib/utils.ts: `cn` 헬퍼
- tailwind.config.ts, postcss.config.js: Tailwind 설정

## 노트(Notes)
- 현재는 목업 데이터만 사용합니다. 이후 실제 데이터/인증 연동 예정.
- 서버 컴포넌트/클라이언트 컴포넌트 경계를 점진적으로 최적화할 계획입니다.
