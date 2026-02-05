# Second Semester (Mock UI)

어두운 테마를 기본으로 하는 학기별 스터디 플래너 대시보드입니다. 현재는 목업 데이터로 동작하며, 페이지는 카드 컴포넌트들을 조립해 보여줍니다.

## 목적(Purpose)
- 저녁 시간대 학습을 가정한 간결한 대시보드 UI
- 진행률/할 일/출결/주간 시간표 등 핵심 정보 한눈에 보기
- 컴포넌트 분리와 클라이언트/서버 경계 최적화 연습

## 버전 기록
- 최신: **v0.2.0** 학습/할일/타임라인 기능 대폭 개선 (2026-02-03)
  - [전체 요약](./docs/버전/v0.2.0-summary.md)
  - [학습 관리](./docs/버전/v0.2.0-learning.md)
  - [할 일 관리](./docs/버전/v0.2.0-todos.md)
  - [타임라인](./docs/버전/v0.2.0-timeline.md)
  - [UI 개선](./docs/버전/v0.2.0-ui-improvements.md)
- v0.1.3 timeline 기능 완성 & persist 적용 (2026-02-02)
- [v0.1.1 컴포넌트 분리 & 정리](./docs/버전/v0.1.1.md)
- [v0.1.0 기본 레이아웃/테마](./docs/버전/v0.1.0.md)

## 사용 기술(Tech Stack)
- Next.js 14 (App Router, React 18)
- TypeScript
- Tailwind CSS, tailwind-merge, tailwindcss-animate
- shadcn 스타일의 최소 UI 컴포넌트(Card, Badge, Progress, Checkbox, Separator)
- 상태 관리: Zustand (with persist middleware)
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
  - layout.tsx: 공통 레이아웃(헤더/본문/푸터). 헤더 우측 버튼은 MY↔MAIN 자동 전환
  - page.tsx: 메인 대시보드(학습 생성 + 통계 + 최근 학습 목록)
  - mypage/
    - page.tsx: 학습 관리 페이지(학습 목록 + 기간 정보 + 생성 모달)
    - learning/[id]/page.tsx: 학습 상세 페이지(진척도/참여 토글/기간 정보/삭제)
    - todos/page.tsx: 할 일 관리(월간 달력 + 목록 + 필터/검색/정렬)
    - timeline/page.tsx: 주간 스케줄(7일 세로 뷰 + 할 일 통합)
    - attendance/page.tsx: 출석 관리(예정)
- components/
  - HeaderNavSwitch.tsx: 현재 경로에 따라 헤더 버튼 MY↔MAIN 전환
  - providers.tsx, theme-toggle.tsx
  - ui/: Card, Progress, Badge, Checkbox, Separator 등 UI 프리미티브
  - detail/: CardDetailLayout, DetailHeader
- lib/
  - store/learnings.ts: 학습 상태(Zustand + persist, 기간 정보 포함)
  - store/todos.ts: 할 일 상태(Zustand + persist)
  - store/timeline.ts: 타임라인 상태(Zustand + persist)
  - utils.ts: `cn` 헬퍼
- docs/
  - 버전/: 버전별 상세 문서(v0.1.0 ~ v0.2.0)
  - 정리/
    - learning-path.md: 학습 경로 가이드
    - flow.md: 플로우 차트
    - architecture/: 아키텍처 문서
- tailwind.config.ts, postcss.config.js: Tailwind 설정

## 주요 기능(Features)

### ✅ 학습 관리
- 학습 생성 (제목 + 시작일/종료일)
- 학습 목록 (기간 정보 표시)
- 학습 상세 (진척도 조절, 참여 토글, 기간 정보, 삭제)
- 기간별 학습 관리

### ✅ 할 일 관리
- 월간 달력 뷰 (년도/월 선택 드롭다운)
- 날짜 hover 시 + 버튼으로 빠른 추가
- 할 일 목록 (필터/검색/정렬)
- 우선순위 설정 (낮음/보통/높음)
- 완료율 표시
- 체크박스 즉시 반응

### ✅ 타임라인 (주간 스케줄)
- 주간 7일 세로 뷰
- 할 일 페이지와 데이터 통합
- 월/일자 선택 드롭다운
- 날짜별 + 버튼으로 빠른 추가
- 날짜별 완료 통계

### ✅ 공통 기능
- 데이터 영속성 (localStorage 자동 저장)
- 다크/라이트 테마 (시스템 설정 자동 감지)
- 반응형 디자인 (모바일/태블릿/데스크톱)
- Controlled Components (즉시 반응)
- 일관된 드롭다운 디자인

### 🚧 예정 기능
- 출석 관리
- 통계 대시보드
- 반복 할 일
- 할 일 카테고리/태그
- 알림 기능

## 노트(Notes)
- Zustand persist로 localStorage에 데이터 자동 저장
- Controlled Components 패턴으로 즉시 반응하는 UI
- 서버/클라이언트 hydration 처리로 안정성 확보
- 일관된 드롭다운 디자인 시스템 적용
- 학습 경로 가이드 문서로 프로젝트 분석 및 학습 지원
- 상세한 버전별 문서로 변경 사항 추적
