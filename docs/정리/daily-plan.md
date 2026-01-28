# 일일 개발 계획

프로젝트: Second Semester — 학기 진행 대시보드
기간: 5일 (카드별 상세페이지 1차 완성 목표)

## Day 1: 라우팅/템플릿 뼈대
- [routes] 상세 경로 생성
  - app/progress/page.tsx
  - app/todos/page.tsx
  - app/attendance/page.tsx
  - app/timeline/page.tsx
- [template] 각 페이지에 최소 템플릿
  - 제목, 간단한 설명, placeholder 섹션 2~3개
  - 각 페이지 `export const metadata` 설정(SEO 타이틀/설명)
- [nav] 대시보드 → 상세 연결 준비
  - 각 카드에 “상세 보기”용 버튼/링크 자리 확보(아직 연결 안 해도 됨)
- [commit]
  - feat(routes): 상세 페이지 라우팅 및 기본 템플릿 추가

## Day 2: 공통 상세 레이아웃 도입 + /progress 상세 1차
- [layout] `CardDetailLayout` 컴포넌트 생성(components/detail)
  - 헤더(제목/설명/뒤로가기 링크/옵션 액션)
  - 컨텐츠 래핑, 기본 여백/그리드 스타일
  - 공통 탭 필요 시 `DetailTabs` 초안 추가
- [page] /progress 상세 구현(목데이터)
  - Summary 카드(진행률, 기간, D-DAY)
  - 진행률 추이 placeholder(차트 영역 div)
  - 기간 통계(지난/남은 일수)
- [link] MainProgressCard → /progress 링크 연결
- [commit]
  - feat(progress): 상세 레이아웃 적용 및 진행 현황 섹션 1차 구현

## Day 3: /todos 상세 1차 + 링크 연결
- [page] /todos 상세 구현(목데이터)
  - 필터(전체/미완/완료), 검색 입력
  - 완료율(도넛 차트 placeholder), 리스트/카운트 카드
- [link] TodoListCard → /todos 링크 연결
- [refactor] 목데이터 분리: lib/fixtures/todos.ts 등으로 이동
- [commit]
  - feat(todos): 상세 페이지 1차 및 카드 링크 연결, 목데이터 분리

## Day 4: /attendance 상세 1차 + /timeline 템플릿 강화
- [page] /attendance 상세 구현(목데이터)
  - 월간 캘린더 뷰 placeholder, 통계 카드(출석/결석)
- [page] /timeline 상세 템플릿 강화(목데이터)
  - 주간/월간 전환 탭, 태그 필터 placeholder, 일정 리스트 골격
- [link] AttendanceCard, WeeklyTimelineCard → 각 상세 링크 연결
- [commit]
  - feat(attendance,timeline): 상세 1차 구현 및 링크 연결

## Day 5: 마감 정리(UX·품질)
- [meta] 각 상세 페이지 metadata 보완(한글 타이틀/설명)
- [loading/error] 각 상세 경로에 `loading.tsx`, `error.tsx`(선택) 추가
- [a11y] 버튼/링크 레이블/aria 보강, 포커스 스타일 확인
- [perf] 불필요한 CSR/SSR 불일치 점검(placeholder/suppressHydrationWarning 재확인)
- [docs] README에 상세페이지 링크/스크린샷/문서 링크 추가
- [commit]
  - chore: 상세 페이지 1차 마감 — 로딩/에러, 접근성, 문서 보강

---

## 참고/선택 과제
- ThemeToggle 동적 import(`ssr: false`)로 SSR 렌더 제거(필요 시)
- Zustand 등 전역 상태 관리 도입 및 목데이터 → API 전환 설계
- 컴포넌트 스토리북 도입, 간단한 유닛 테스트 추가

## 진행 체크리스트(요약)
- [ ] Day 1: 상세 라우팅/템플릿
- [ ] Day 2: 레이아웃 + /progress
- [ ] Day 3: /todos + 링크
- [ ] Day 4: /attendance + /timeline 템플릿 강화
- [ ] Day 5: 메타/로딩/에러/A11y/문서
