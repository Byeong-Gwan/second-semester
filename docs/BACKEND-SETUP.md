# 백엔드 개발 준비 가이드

## 📅 작성일
2026년 2월 12일

---

## 🎯 목표

Second Semester 프로젝트의 백엔드를 구축하여 LocalStorage 기반의 클라이언트 사이드 데이터를 서버로 마이그레이션하고, 실시간 동기화, 사용자 인증, 데이터 백업 등의 기능을 구현합니다.

---

## 🏗️ 백엔드 아키텍처 추천

### 🥇 추천: Next.js API Routes + Supabase

#### 이유
- **프론트엔드와 통합**: 이미 Next.js 사용 중
- **간단한 배포**: Vercel에서 함께 배포 가능
- **실시간 기능**: Supabase 실시간 구독 지원
- **인증 내장**: Supabase Auth 사용
- **데이터베이스**: PostgreSQL 자동 제공
- **무료 플랜**: 충분한 무료 사용량

#### 기술 스택
```
Frontend: Next.js 14 (App Router)
Backend: Next.js API Routes
Database: Supabase (PostgreSQL)
Auth: Supabase Auth
Real-time: Supabase Realtime
Deployment: Vercel
```

---

### 🥈 대안: Node.js + Express + MongoDB

#### 이유
- **유연성**: 자유로운 아키텍처 설계
- **확장성**: 대규모 데이터 처리에 용이
- **커뮤니티**: 방대한 생태계

#### 기술 스택
```
Backend: Node.js + Express
Database: MongoDB Atlas
Auth: JWT + bcrypt
Real-time: Socket.io
Deployment: AWS/Heroku
```

---

### 🥉 대안: Firebase

#### 이유
- **간편함**: 최소한의 설정
- **실시간**: Firebase Realtime Database
- **인증**: Firebase Auth

#### 기술 스택
```
Backend: Firebase Functions
Database: Firestore
Auth: Firebase Auth
Real-time: Firestore Realtime
Deployment: Firebase Hosting
```

---

## 📊 데이터베이스 구조 설계

### Supabase 기준 테이블 설계

#### 1. users 테이블
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. study_logs 테이블
```sql
CREATE TABLE study_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  progress INTEGER DEFAULT 0,
  start_time TIME,
  end_time TIME,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. reflections 테이블
```sql
CREATE TABLE reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  mood VARCHAR(20),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### 4. todos 테이블
```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. events 테이블
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. attendance 테이블
```sql
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'present', 'late', 'absent'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

---

## 🔌 API 엔드포인트 설계

### Next.js API Routes 구조

#### 1. 인증 관련
```
/api/auth/
  ├── register/      POST  - 회원가입
  ├── login/         POST  - 로그인
  ├── logout/        POST  - 로그아웃
  └── me/           GET   - 현재 사용자 정보
```

#### 2. 학습 로그 관련
```
/api/study-logs/
  ├──               GET   - 전체 학습 로그
  ├──               POST  - 학습 로그 생성
  ├── [id]/         GET   - 특정 학습 로그
  ├── [id]/         PUT   - 학습 로그 수정
  └── [id]/         DELETE - 학습 로그 삭제
```

#### 3. 회고 관련
```
/api/reflections/
  ├──               GET   - 전체 회고
  ├──               POST  - 회고 생성
  ├── [id]/         GET   - 특정 회고
  ├── [id]/         PUT   - 회고 수정
  └── [id]/         DELETE - 회고 삭제
```

#### 4. 할 일 관련
```
/api/todos/
  ├──               GET   - 전체 할 일
  ├──               POST  - 할 일 생성
  ├── [id]/         GET   - 특정 할 일
  ├── [id]/         PUT   - 할 일 수정
  └── [id]/         DELETE - 할 일 삭제
```

#### 5. 이벤트 관련
```
/api/events/
  ├──               GET   - 전체 이벤트
  ├──               POST  - 이벤트 생성
  ├── [id]/         GET   - 특정 이벤트
  ├── [id]/         PUT   - 이벤트 수정
  └── [id]/         DELETE - 이벤트 삭제
```

#### 6. 출석 관련
```
/api/attendance/
  ├──               GET   - 전체 출석
  ├──               POST  - 출석 체크
  ├── [id]/         GET   - 특정 출석
  ├── [id]/         PUT   - 출석 수정
  └── [id]/         DELETE - 출석 삭제
```

---

## 🔐 인증 시스템 설계

### Supabase Auth 사용

#### 1. 설정
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 2. 인증 훅
```typescript
// hooks/useAuth.ts
import { useSupabaseAuth } from './useSupabaseAuth'

export function useAuth() {
  const { user, session, loading } = useSupabaseAuth()
  
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }
  
  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { data, error }
  }
  
  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }
  
  return {
    user,
    session,
    loading,
    login,
    register,
    logout,
  }
}
```

---

## 🚀 단계별 구현 계획

### Phase 1: 기본 설정 (1-2일)
1. **Supabase 프로젝트 생성**
   - 프로젝트 설정
   - 데이터베이스 테이블 생성
   - API 키 설정

2. **환경 변수 설정**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **기본 클라이언트 설정**
   - Supabase 클라이언트 설정
   - 기본 CRUD 함수 작성

### Phase 2: 인증 시스템 (2-3일)
1. **인증 페이지 구현**
   - 로그인 페이지
   - 회원가입 페이지
   - 비밀번호 재설정

2. **인증 미들웨어**
   - 보호된 라우트
   - 사용자 상태 관리

### Phase 3: 데이터 마이그레이션 (3-4일)
1. **API 엔드포인트 구현**
   - 각 테이블별 CRUD API
   - 데이터 검증
   - 에러 처리

2. **프론트엔드 연동**
   - Zustand store 수정
   - API 호출 함수 작성
   - 로딩/에러 상태 처리

### Phase 4: 실시간 기능 (2-3일)
1. **실시간 구독**
   - Supabase Realtime 구독
   - 데이터 자동 동기화
   - 오프라인 지원

2. **충돌 해결**
   - 동시성 문제 해결
   - 데이터 동기화 전략

### Phase 5: 고급 기능 (3-4일)
1. **데이터 백업**
   - 자동 백업 시스템
   - 데이터 내보내기/가져오기

2. **성능 최적화**
   - 캐싱 전략
   - API 최적화
   - 데이터베이스 인덱스

---

## 📦 필요한 패키지

### Supabase 기반
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @supabase/auth-helpers-react @supabase/auth-ui-react
npm install @supabase/auth-ui-shared
```

### 유틸리티
```bash
npm install date-fns uuid
npm install @types/uuid
```

### 개발 도구
```bash
npm install -D @supabase/supabase-js
```

---

## 🔧 개발 환경 설정

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 가입
2. 새 프로젝트 생성
3. 데이터베이스 테이블 생성
4. API 키 복사

### 2. 로컬 개발 환경
```bash
# 프로젝트 클론
git clone <repository-url>
cd second-semester

# 패키지 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 Supabase 키 추가

# 개발 서버 시작
npm run dev
```

### 3. 데이터베이스 마이그레이션
```sql
-- Supabase SQL Editor에서 실행
-- 위에 제공된 테이블 생성 쿼리 실행
```

---

## 📋 체크리스트

### 시작 전 준비
- [ ] Supabase 계정 생성
- [ ] 프로젝트 생성
- [ ] 데이터베이스 테이블 설계
- [ ] API 키 발급

### 개발 환경
- [ ] 환경 변수 설정
- [ ] 패키지 설치
- [ ] 기본 클라이언트 설정
- [ ] 데이터베이스 연결 테스트

### 인증 시스템
- [ ] 로그인/회원가입 UI
- [ ] 인증 미들웨어
- [ ] 사용자 상태 관리

### API 구현
- [ ] CRUD 엔드포인트
- [ ] 데이터 검증
- [ ] 에러 처리

### 프론트엔드 연동
- [ ] Zustand store 수정
- [ ] API 호출 함수
- [ ] 로딩/에러 상태

---

## 💡 팁 및 주의사항

### 1. 데이터 마이그레이션 전략
- LocalStorage 데이터를 JSON으로 내보내기
- 서버로 일괄 업로드 기능 제공
- 사용자가 직접 마이그레이션할 수 있도록

### 2. 오프라인 지원
- Service Worker 구현
- 오프라인 시 로컬 저장
- 온라인 시 자동 동기화

### 3. 성능 고려사항
- 페이지네이션 구현
- 데이터 캐싱
- 이미지 최적화

### 4. 보안
- RLS (Row Level Security) 설정
- API 키 보안
- 입력 데이터 검증

---

## 🎯 예상 개발 기간

- **총 예상 기간**: 2-3주
- **최소 기능**: 1주 (인증 + 기본 CRUD)
- **전체 기능**: 3주 (실시간 + 고급 기능)

---

## 📚 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)

---

**작성일**: 2026-02-12  
**예상 완료일**: 2026-03-05  
**담당자**: 개발자
