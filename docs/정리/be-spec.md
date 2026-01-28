# BE 사양서 (Second Semester)

목표: 본 문서만으로 API/스키마/보안/RLS/배포를 단계별로 구현할 수 있도록 합니다.
권장 스택: Next.js Route Handlers + Supabase(Postgres + Auth + RLS)

---

## 1. 환경 변수(.env) 정의
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # 서버에서만 사용(절대 클라이언트 번들 금지)

# Sentry / Monitoring (선택)
SENTRY_DSN=...

# Node / Next
NODE_OPTIONS=--max_old_space_size=4096
```
주의: SERVICE_ROLE_KEY는 서버 경로(Route Handler/Server Action)에서만 사용. Vercel 프로젝트 환경 변수에 저장.

---

## 2. 데이터 모델(DDL) 및 인덱스
Postgres (Supabase SQL Editor 또는 migration 스크립트)
```sql
create table if not exists public.users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.semesters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  start date not null,
  end date not null,
  progress int not null default 0,
  created_at timestamptz default now()
);
create index on public.semesters(owner_id);

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  done boolean not null default false,
  due timestamptz null,
  created_at timestamptz default now()
);
create index on public.todos(owner_id);
create index on public.todos(done);
create index on public.todos(due);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  date date not null,
  status text not null check (status in ('present','absent')),
  created_at timestamptz default now(),
  unique (owner_id, date)
);
create index on public.attendance(owner_id);
create index on public.attendance(date);

create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  start timestamptz not null,
  end timestamptz not null,
  tag text not null,
  note text null,
  created_at timestamptz default now()
);
create index on public.timeline_items(owner_id);
create index on public.timeline_items(start);
create index on public.timeline_items(end);
```

---

## 3. RLS 정책(Row Level Security)
```sql
alter table public.semesters enable row level security;
alter table public.todos enable row level security;
alter table public.attendance enable row level security;
alter table public.timeline_items enable row level security;

-- 인증 사용자 식별: auth.uid()
create policy "own-read" on public.semesters for select using (owner_id = auth.uid());
create policy "own-write" on public.semesters for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "own-read" on public.todos for select using (owner_id = auth.uid());
create policy "own-write" on public.todos for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "own-read" on public.attendance for select using (owner_id = auth.uid());
create policy "own-write" on public.attendance for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "own-read" on public.timeline_items for select using (owner_id = auth.uid());
create policy "own-write" on public.timeline_items for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
```

---

## 4. API 계약(REST 스타일, Next Route Handlers)
경로 기준: `/app/api/*` (App Router)
응답 공통 형태:
```json
{ "ok": true, "data": ... }
{ "ok": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": { ... } } }
```

### 4.1 진행 현황
- GET `/api/progress?semesterId`
  - 200: `{ progress, start, end, dday, history: [{ date, value }] }`
  - 400: semesterId 누락/형식 오류
  - 404: 접근 권한 없음 또는 없음

### 4.2 할 일
- GET `/api/todos?status=all|open|done&query=...&limit=20&cursor=...`
  - 200: `{ items: Todo[], nextCursor?: string }`
- POST `/api/todos`
  - body: `{ title: string; due?: string }`
  - 201: `{ id: string }`
- PATCH `/api/todos/:id`
  - body: `{ title?: string; done?: boolean; due?: string|null }`
  - 200
- DELETE `/api/todos/:id`
  - 204

### 4.3 출석
- GET `/api/attendance?from=YYYY-MM-DD&to=YYYY-MM-DD`
  - 200: `{ days: [{ date, status }], rate: number, streak: number }`
- POST `/api/attendance`
  - body: `{ date: string; status: 'present'|'absent' }`
  - 201: `{ id: string }`

### 4.4 타임라인
- GET `/api/timeline?view=week|month&from&to&tag`
  - 200: `{ items: TimelineItem[] }`
- POST `/api/timeline`
  - body: `{ start, end, tag, note? }`
  - 201: `{ id }`
- PATCH `/api/timeline/:id`
- DELETE `/api/timeline/:id`

---

## 5. 유효성 검사(zod) 스키마(서버)
```ts
import { z } from 'zod'
export const SemesterId = z.string().uuid()
export const TodoCreate = z.object({ title: z.string().min(1), due: z.string().datetime().optional() })
export const TodoUpdate = z.object({ title: z.string().min(1).optional(), done: z.boolean().optional(), due: z.string().datetime().nullable().optional() })
export const AttendanceUpsert = z.object({ date: z.string().date(), status: z.enum(['present','absent']) })
export const TimelineCreate = z.object({ start: z.string().datetime(), end: z.string().datetime(), tag: z.string().min(1), note: z.string().optional() })
```

---

## 6. 인증/권한
- Supabase Auth 사용 시: 클라이언트에서 세션 포함 요청 → RLS로 자동 필터
- 서버 요청에서 추가 권한 필요 시 SERVICE_ROLE_KEY 사용(서버 전용)
- 보호 라우트: 미들웨어 또는 서버에서 세션 확인 후 401 반환

---

## 7. 보안 베이스라인
- Rate Limiting: IP/세션 기준(예: 60 req/1m). 업로드/변이 경로 우선 적용
- 입력 검증: zod → 400/422로 명확한 오류 반환
- 에러 처리: 내부 에러 메시지 노출 금지, 공통 에러 포맷
- 보안 헤더/CSP: next.config.js `headers()`로 설정, Report-Only에서 시작하여 점진 적용

---

## 8. 폴더 구조 가이드
```
app/
  api/
    progress/route.ts
    todos/route.ts           # GET, POST
    todos/[id]/route.ts      # PATCH, DELETE
    attendance/route.ts
    timeline/route.ts
lib/
  db/supabase.ts             # createServerClient, createBrowserClient
  validators/               
  services/                 # 도메인 로직(쿼리, 계산)
  utils/
```

---

## 9. 예시 코드 스니펫
- 서버에서 Supabase 클라이언트
```ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function serverSupabase() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
}
```

- 표준 응답 헬퍼
```ts
export const ok = (data: unknown, init?: number) => Response.json({ ok: true, data }, { status: init ?? 200 })
export const bad = (code: string, message: string, details?: unknown, init?: number) => Response.json({ ok: false, error: { code, message, details } }, { status: init ?? 400 })
```

---

## 10. 페이지네이션/정렬
- 커서 기반 페이지네이션 권장: `?limit=20&cursor=<created_at,id>`
- 정렬 기준: `created_at desc`

---

## 11. 관측성/로그
- Sentry: API 경로 에러 캡처, PII 제거 필터링
- Web Vitals(프론트)와 상관관계 분석(선택)

---

## 12. 마이그레이션 전략
- SQL 스크립트 버전 관리: `supabase/migrations/YYYYMMDDHHMM.sql`
- CI에서 마이그레이션 dry-run → deploy에 적용

---

## 13. 단계별 실행(붙여넣기 체크리스트)
1) Supabase 프로젝트 생성, URL/키 발급 → .env 설정
2) DDL 실행(테이블/인덱스) → RLS 활성화/정책 적용
3) lib/db/supabase.ts 생성(서버/클라이언트 팩토리)
4) validators 스키마 생성(zod)
5) Route Handlers 생성(`/api/*`), ok/bad 헬퍼 도입
6) 인증 미들웨어 또는 각 핸들러에서 세션 체크
7) Rate limit 적용(미들웨어/엣지 함수)
8) next.config.js 보안 헤더/CSP 추가 → Report-Only로 검증 후 Enforce
9) Sentry 연결(선택), 로깅 표준화
10) CI에서 typecheck/lint/test/build + 프리뷰 배포

---

## 14. 에러 코드 표(예시)
- VALIDATION_ERROR(422)
- UNAUTHORIZED(401)
- FORBIDDEN(403)
- NOT_FOUND(404)
- RATE_LIMITED(429)
- INTERNAL(500)

---

## 15. 성능/비용 주의
- 선택적 컬럼 인덱스 점검(과잉 인덱스 비용)
- 대량 조회는 기간 제한/커서 페이징 필수
- 웹훅/긴 작업은 백그라운드 큐(선택)
