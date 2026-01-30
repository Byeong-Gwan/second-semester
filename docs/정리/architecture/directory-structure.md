# 디렉토리 구조(2026-01-28 기준)

아주 쉬운 말로: 폴더가 어떤 방인지, 그 방에서 무엇을 하는지 설명해요.

## 앱(app) 폴더
- app/layout.tsx
  - 모든 페이지의 공통 틀(헤더/본문/푸터)
  - 헤더 오른쪽 버튼은 `MY`↔`MAIN`으로 자동 전환돼요.
- app/page.tsx
  - 메인 페이지(대시보드)
  - 히어로 섹션 + "학습 만들기" 모달 + 최근 학습 간단 목록
- app/mypage/
  - 나의 학습 관리 영역
  - app/mypage/page.tsx: 학습 목록 상세 관리(삭제/참여 토글/진척도 조절)
  - app/mypage/_components/*: 마이페이지 전용 카드/컴포넌트(필요 시)
  - app/mypage/todos/page.tsx: (자리잡기)
  - app/mypage/attendance/page.tsx: (자리잡기)
  - app/mypage/timeline/page.tsx: (자리잡기)
  - app/mypage/progress/page.tsx: (자리잡기)

## 공용 컴포넌트(components)
- components/HeaderNavSwitch.tsx
  - 현재 경로에 따라 헤더 버튼 라벨/링크를 `MY`↔`MAIN`으로 바꿔줘요.
- components/providers.tsx
  - 테마 등 전역 Provider 모음
- components/ui/*
  - shadcn/ui 래퍼 컴포넌트들(Card/Badge/Checkbox/Progress/Separator 등)
- components/detail/*
  - 상세 페이지 레이아웃 구성 요소(CardDetailLayout, DetailHeader)

## 라이브러리(lib)
- lib/store/learnings.ts
  - 학습(learning) 상태 저장소(Zustand)
  - 상태: `learnings`
  - 액션: `addLearning`, `removeLearning`, `toggleJoined`, `updateProgress`
- lib/store/timeline.ts
  - 타임라인 상태 저장소(Zustand) 및 유틸

## 문서(docs)
- docs/정리/notes/2026-01-28-worklog.md
  - 오늘 한 작업 요약(아주 쉬운 말 포함)
- docs/정리/architecture/directory-structure.md (이 문서)
  - 현재 디렉토리 구조와 역할 설명
- docs/정리/fe/spec.md, docs/정리/be/spec.md
  - 화면/백엔드 스펙 문서
- docs/정리/plans/roadmap.md
  - 개발 로드맵

## 5살도 이해하기(초 간단)
- 메인 집(app) 안에 방(page)들이 있어요.
- 첫 번째 방(메인)은 공부 계획을 만들고 최근 걸 살짝 보여줘요.
- 두 번째 방(MY)은 내가 만든 걸 자세히 정리하고 고쳐요.
- 문 옆 스위치(MY/Main 버튼)는 내가 있는 곳에 맞춰 글자가 바뀌어요.
