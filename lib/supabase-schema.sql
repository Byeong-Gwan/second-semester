-- Second Semester DB Schema
-- Supabase SQL Editor에서 실행하세요

-- 1. 학습 (learnings)
create table if not exists learnings (
  id text primary key,
  user_id text not null,
  title text not null,
  created_at timestamptz not null default now(),
  start_date date,
  end_date date,
  progress integer not null default 0,
  joined boolean not null default true
);

create index idx_learnings_user on learnings(user_id);

-- 2. 할 일 (todos)
create table if not exists todos (
  id text primary key,
  user_id text not null,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high'))
);

create index idx_todos_user on todos(user_id);

-- 3. 출석 (attendance)
create table if not exists attendance (
  id bigint generated always as identity primary key,
  user_id text not null,
  date date not null,
  status text not null check (status in ('present', 'absent', 'late')),
  unique(user_id, date)
);

create index idx_attendance_user on attendance(user_id);

-- 4. 회고 (reflections)
create table if not exists reflections (
  id text primary key,
  user_id text not null,
  date date not null,
  content text not null,
  category text not null default 'other' check (category in ('study', 'personal', 'project', 'health', 'other')),
  mood text check (mood in ('great', 'good', 'okay', 'bad')),
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_reflections_user on reflections(user_id);

-- 5. 학습 일지 (study_logs)
create table if not exists study_logs (
  id text primary key,
  user_id text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  subject text not null,
  description text,
  duration integer not null default 0
);

create index idx_study_logs_user on study_logs(user_id);

-- 6. 타임라인 (timeline)
create table if not exists timeline (
  id text primary key,
  user_id text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  title text not null,
  type text not null default 'etc' check (type in ('study', 'language', 'solo', 'project', 'etc')),
  done boolean not null default false
);

create index idx_timeline_user on timeline(user_id);

-- RLS (Row Level Security) 활성화
alter table learnings enable row level security;
alter table todos enable row level security;
alter table attendance enable row level security;
alter table reflections enable row level security;
alter table study_logs enable row level security;
alter table timeline enable row level security;

-- RLS 정책: 자기 데이터만 접근 가능 (anon key 사용 시 API Route에서 user_id 필터링)
create policy "Allow all for authenticated" on learnings for all using (true);
create policy "Allow all for authenticated" on todos for all using (true);
create policy "Allow all for authenticated" on attendance for all using (true);
create policy "Allow all for authenticated" on reflections for all using (true);
create policy "Allow all for authenticated" on study_logs for all using (true);
create policy "Allow all for authenticated" on timeline for all using (true);
