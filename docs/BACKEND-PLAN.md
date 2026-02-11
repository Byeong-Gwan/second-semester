# 백엔드 구현 계획 (Supabase + Google Auth)

## 🎯 목표
- Supabase를 백엔드로 사용
- Google OAuth로 로그인
- 데이터 멀티 디바이스 동기화

---

## 📦 필요한 패키지

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

---

## 🗄️ 데이터베이스 스키마

### 1. users (Supabase Auth 자동 생성)
- id (UUID, Primary Key)
- email
- created_at

### 2. learnings
```sql
CREATE TABLE learnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  joined BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE learnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own learnings"
  ON learnings
  FOR ALL
  USING (auth.uid() = user_id);
```

### 3. todos
```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own todos"
  ON todos
  FOR ALL
  USING (auth.uid() = user_id);
```

### 4. timeline_items
```sql
CREATE TABLE timeline_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own timeline items"
  ON timeline_items
  FOR ALL
  USING (auth.uid() = user_id);
```

### 5. attendance_records
```sql
CREATE TABLE attendance_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own attendance"
  ON attendance_records
  FOR ALL
  USING (auth.uid() = user_id);
```

---

## 🔐 Supabase 설정

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 가입
2. New Project 생성
3. Database Password 설정
4. Region: Northeast Asia (Seoul) 선택

### 2. Google OAuth 설정
1. Supabase Dashboard → Authentication → Providers
2. Google 활성화
3. [Google Cloud Console](https://console.cloud.google.com) 이동
4. OAuth 2.0 클라이언트 ID 생성
   - Authorized redirect URIs: `https://<project-ref>.supabase.co/auth/v1/callback`
5. Client ID와 Client Secret을 Supabase에 입력

### 3. 환경 변수 설정
`.env.local`에 추가:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 💻 코드 구현

### 1. Supabase 클라이언트 생성
`lib/supabase/client.ts`:
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

### 2. 로그인 페이지
`app/login/page.tsx`:
```typescript
'use client'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <button onClick={handleGoogleLogin}>
      Google로 로그인
    </button>
  )
}
```

### 3. Auth Callback
`app/auth/callback/route.ts`:
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(requestUrl.origin)
}
```

### 4. Zustand → Supabase 마이그레이션
기존 `useLearningStore`를 Supabase 연동으로 변경:

```typescript
import { supabase } from '@/lib/supabase/client'
import { create } from 'zustand'

interface Learning {
  id: string
  title: string
  progress: number
  // ...
}

interface LearningStore {
  learnings: Learning[]
  loading: boolean
  fetchLearnings: () => Promise<void>
  addLearning: (learning: Omit<Learning, 'id'>) => Promise<void>
  // ...
}

export const useLearningStore = create<LearningStore>((set, get) => ({
  learnings: [],
  loading: false,
  
  fetchLearnings: async () => {
    set({ loading: true })
    const { data, error } = await supabase
      .from('learnings')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      set({ learnings: data, loading: false })
    }
  },
  
  addLearning: async (learning) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data, error } = await supabase
      .from('learnings')
      .insert([{ ...learning, user_id: user.id }])
      .select()
      .single()
    
    if (!error && data) {
      set({ learnings: [data, ...get().learnings] })
    }
  },
  
  // ... 나머지 메서드들
}))
```

---

## 🔄 마이그레이션 단계

### Phase 1: 준비 (1일)
- [ ] Supabase 프로젝트 생성
- [ ] Google OAuth 설정
- [ ] 환경 변수 설정
- [ ] 패키지 설치

### Phase 2: 인증 구현 (2일)
- [ ] 로그인 페이지 생성
- [ ] Auth callback 구현
- [ ] 로그아웃 기능
- [ ] 보호된 라우트 설정

### Phase 3: 데이터베이스 마이그레이션 (3-5일)
- [ ] 스키마 생성
- [ ] RLS 정책 설정
- [ ] Zustand → Supabase 전환 (learnings)
- [ ] Zustand → Supabase 전환 (todos)
- [ ] Zustand → Supabase 전환 (timeline)
- [ ] Zustand → Supabase 전환 (attendance)

### Phase 4: 실시간 동기화 (1일)
- [ ] Realtime subscriptions 설정
- [ ] 멀티 디바이스 테스트

### Phase 5: 테스트 및 배포 (2일)
- [ ] 기능 테스트
- [ ] 성능 최적화
- [ ] 프로덕션 배포

**총 예상 기간**: 7-10일

---

## 💰 비용

### Supabase 무료 플랜
- 500MB 데이터베이스
- 50,000 월간 활성 사용자
- 2GB 파일 저장소
- 50GB 대역폭

→ **개인 프로젝트/소규모 서비스에 충분**

### Pro 플랜 ($25/월)
- 8GB 데이터베이스
- 100,000 월간 활성 사용자
- 필요 시 업그레이드

---

## 🎯 장점

1. **멀티 디바이스 동기화**: 폰, 태블릿, PC 어디서나 접근
2. **데이터 안전성**: 클라우드 백업
3. **확장성**: 사용자 증가에 대응 가능
4. **실시간 협업**: 나중에 팀 기능 추가 가능
5. **보안**: Row Level Security로 데이터 보호

---

## 📝 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js + Supabase 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Google OAuth 설정](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

**현재는 localStorage로 충분하지만, 백엔드가 필요해지면 이 계획을 따라 진행하면 됩니다!**
