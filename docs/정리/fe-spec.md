# FE 사양서 (Second Semester)

목표: 본 문서만으로 UI 구조/상태/이벤트/데이터 계약을 빠르게 구현할 수 있도록 합니다.

---

## 1. 라우팅 구조(App Router)
- `/` 대시보드
- `/progress` 진행 현황 상세
- `/todos` 할 일 상세
- `/attendance` 출석 상세
- `/timeline` 주간 타임라인 상세

선택: 각 상세 경로에 `loading.tsx`, `error.tsx`를 둘 수 있음.

---

## 2. 공통 레이아웃/컴포넌트
- `components/detail/CardDetailLayout.tsx`
  - props: `{ title: string; description?: string; actions?: ReactNode; children: ReactNode }`
  - 역할: 상세 상단 헤더(제목/설명/액션), 본문 컨테이너
- `components/detail/DetailHeader.tsx`
  - props: `{ title: string; description?: string; backHref?: string; actions?: ReactNode }`
  - 역할: 뒤로가기/브레드크럼 + 제목/설명 + 우측 액션 버튼 영역

접근성
- header/main/section 의미론적 요소 사용
- 버튼/아이콘에 `aria-label`, 포커스 스타일 보장

---

## 3. 페이지별 UI/상태/이벤트

### 3.1 `/` 대시보드
- 구성 컴포넌트
  - ~~`Header`: 학기명, 기간(ko 로케일), 테마 토글~~
  - ~~`MainProgressCard`: 진행률, D-DAY, 오늘 할 일 카운트~~
  - ~~`TodoListCard`: 오늘/다가오는 할 일 요약~~
  - ~~`AttendanceCard`: 이번주 출석 요약~~
  - ~~`WeeklyTimelineCard`: 이번주 일정 요약~~
- 네비게이션
  - 각 카드에 "상세 보기" 링크
- 상태(목데이터 → API)
  - `semester`: `{ name, start, end, progress }`
  - `todos`: `Array<{ id, title, done, due? }>`
  - `attendance`: `Array<{ date: string; status: 'present'|'absent' }>`
  - `timeline`: `Array<{ id, start, end, tag, note }>`
- 이벤트
  - ~~테마 토글: `onToggleTheme()`~~
  - 카드 링크 클릭: `/progress`, `/todos`, `/attendance`, `/timeline`

### 3.2 `/progress`
- 섹션
  - Summary: 진행률, 기간, D-DAY
  - 추이(placeholder → 차트 라이브러리 후속): 주/월간 진행률 라인 차트
  - 기간 통계: 남은 일수/지난 일수
- 데이터 계약(FE 기대)
  - GET `/api/progress?semesterId` → `{ progress: number; start: string; end: string; dday: number; history: Array<{ date: string; value: number }>; }`
- 상태/이벤트
  - 상태: `progress`, `historyRange`(week|month)
  - 이벤트: `onChangeHistoryRange(range)`

### 3.3 `/todos`
- 섹션
  - 컨트롤바: 필터(전체/미완/완료), 검색
  - 완료율(도넛 차트 placeholder)
  - 리스트: 체크/삭제/편집(편집은 모달 또는 인라인 편집)
- 데이터 계약
  - GET `/api/todos?status&query` → `{ items: Todo[] }`
  - POST `/api/todos` body: `{ title: string; due?: string }` → `{ id: string }`
  - PATCH `/api/todos/:id` body: `{ title?: string; done?: boolean; due?: string|null }`
  - DELETE `/api/todos/:id`
- 상태/이벤트
  - 상태: `filter`, `query`, `items`, `creating`, `updating`, `deleting`
  - 이벤트:
    - `onFilterChange(filter)`
    - `onQueryChange(query)`
    - `onCreateTodo(title, due?)`
    - `onToggleDone(id, done)`
    - `onEditTitle(id, title)`
    - `onDelete(id)`

### 3.4 `/attendance`
- 섹션
  - 월간 캘린더(placeholder): 출석/결석 표시
  - 통계 카드: 출석률, 연속 출석 일수 등
- 데이터 계약
  - GET `/api/attendance?from&to` → `{ days: Array<{ date: string; status: 'present'|'absent' }>, rate: number, streak: number }`
  - POST `/api/attendance` body: `{ date: string; status: 'present'|'absent' }`
- 상태/이벤트
  - 상태: `month`, `days`, `rate`, `streak`
  - 이벤트: `onMonthChange(month)`, `onToggleDay(date)`

### 3.5 `/timeline`
- 섹션
  - 뷰 전환: `week | month`
  - 태그 필터: `study | exercise | etc` 등
  - 일정 리스트/타임라인
- 데이터 계약
  - GET `/api/timeline?view&from&to&tag` → `{ items: TimelineItem[] }`
  - POST `/api/timeline` body: `{ start: string; end: string; tag: string; note?: string }`
  - PATCH `/api/timeline/:id` body: `{ start?: string; end?: string; tag?: string; note?: string }`
  - DELETE `/api/timeline/:id`
- 상태/이벤트
  - 상태: `view`, `tag`, `items`
  - 이벤트: `onViewChange(view)`, `onTagChange(tag)`, `onCreateItem`, `onUpdateItem`, `onDeleteItem`

---

## 4. 타입/스키마(공유 모델)
```ts
export type ID = string;

export interface Semester { id: ID; name: string; start: string; end: string; progress: number }
export interface Todo { id: ID; title: string; done: boolean; due?: string | null }
export interface AttendanceDay { date: string; status: 'present' | 'absent' }
export interface TimelineItem { id: ID; start: string; end: string; tag: string; note?: string }
```

Zod 스키마(요약)
```ts
import { z } from 'zod'
export const TodoCreate = z.object({ title: z.string().min(1), due: z.string().datetime().optional() })
export const TodoUpdate = z.object({ title: z.string().min(1).optional(), done: z.boolean().optional(), due: z.string().datetime().nullable().optional() })
```

---

## 5. 상태 관리/데이터 패턴
- 1단계: SWR로 GET 캐시, 변이 시 `mutate()`로 갱신
- 2단계: 전역 스토어(zustand)로 뷰 상태 관리(필터, 검색, 탭 등)
- 에러/로딩 상태: 버튼 `disabled`, 스켈레톤/스피너, 토스트 알림

---

## 6. 접근성/국제화
- ~~ko 로케일(date-fns) 적용, 날짜 포맷은 서버/클라이언트 일관성 유지~~
- 아이콘만 있는 버튼은 모든 곳에 `aria-label` 제공
- 포커스 가능한 요소의 명확한 outline 유지, 키보드 탐색 지원

---

## 7. 스타일/컴포넌트 가이드
- Tailwind + shadcn/ui
- 일관된 spacing(컨테이너 paddings, 카드 간격), 타이포 스케일 사용
- 다크/라이트 간 대비 확인(AA 기준)

---

## 8. 에러/토스트 표준
- 성공: 상단 또는 우하단 토스트(3s 자동 닫힘)
- 실패: 에러 메시지와 함께 재시도 버튼 제공
- 폼 에러: 입력 옆 에러 텍스트 + aria 연결

---

## 9. 텔레메트리(선택)
- 버튼 클릭/전환 이벤트 최소 수집, PII 제외
- 페이지 뷰/성능 Web Vitals 전송

---

## 10. 구현 순서 제안(FE)
1) 상세 페이지 템플릿 생성 + 레이아웃 적용
2) /progress 1차 구현 → 대시보드 링크 연결
3) /todos 1차 구현(필터/검색/토글/생성) → 링크 연결
4) /attendance, /timeline 1차 구현 → 링크 연결
5) a11y/로딩/에러/토스트 보강
