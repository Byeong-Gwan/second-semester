# 설치 및 설정 가이드

Second Semester 프로젝트를 처음 설치하고 실행하는 방법을 단계별로 안내합니다.

---

## 📋 사전 요구사항

### 필수
- **Node.js 18+** (권장: LTS 버전)
- **npm** (Node.js와 함께 설치됨)

### 선택 (대체 가능)
- **pnpm** 또는 **yarn** (npm 대신 사용 가능)

### 확인 방법
```bash
node --version  # v18.0.0 이상
npm --version   # 9.0.0 이상
```

---

## 🚀 설치 단계

### 1. 저장소 클론
```bash
git clone <repository-url>
cd second-semester
```

### 2. 의존성 설치
```bash
npm install
```

설치되는 주요 패키지:
- `next` (14.x): React 프레임워크
- `react` (18.x): UI 라이브러리
- `typescript`: 타입 안전성
- `zustand`: 상태 관리
- `tailwindcss`: CSS 프레임워크
- `lucide-react`: 아이콘
- `date-fns`: 날짜 유틸리티
- `next-themes`: 테마 관리

### 3. 환경 변수 설정 (선택)

**v0.5.0부터 날씨/뉴스 기능을 사용하려면 필수**

```bash
# .env.local 파일 생성
cp .env.local.example .env.local
```

`.env.local` 파일 편집:
```env
# OpenWeatherMap API
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here

# 네이버 검색 API
NEXT_PUBLIC_NAVER_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_client_secret_here
```

API 키 발급 방법은 [API 설정 가이드](./API-SETUP.md) 참고

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 🔧 사용 가능한 명령어

### 개발
```bash
npm run dev          # 개발 서버 실행 (http://localhost:3000)
```

### 빌드
```bash
npm run build        # 프로덕션 빌드
npm start            # 프로덕션 서버 실행
```

### 코드 품질
```bash
npm run lint         # ESLint 실행
npm run lint:fix     # ESLint 자동 수정 (있다면)
```

### 타입 체크
```bash
npx tsc --noEmit     # TypeScript 타입 체크
```

---

## 📦 패키지 구조

### 프로덕션 의존성
```json
{
  "next": "14.x",
  "react": "18.x",
  "react-dom": "18.x",
  "zustand": "^4.x",
  "tailwindcss": "^3.x",
  "lucide-react": "^0.x",
  "date-fns": "^3.x",
  "next-themes": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

### 개발 의존성
```json
{
  "typescript": "^5.x",
  "@types/node": "^20.x",
  "@types/react": "^18.x",
  "@types/react-dom": "^18.x",
  "eslint": "^8.x",
  "eslint-config-next": "14.x",
  "postcss": "^8.x",
  "tailwindcss": "^3.x"
}
```

---

## 🗂️ 프로젝트 구조

```
second-semester/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 공통 레이아웃
│   ├── page.tsx           # 메인 페이지
│   ├── weather/           # 날씨+뉴스 페이지 [v0.5.0]
│   ├── api/               # API Routes [v0.5.0]
│   └── mypage/            # 마이페이지
├── components/            # React 컴포넌트
│   ├── ui/               # UI 프리미티브
│   └── detail/           # 상세 페이지 컴포넌트
├── lib/                   # 유틸리티 & 로직
│   ├── store/            # Zustand 스토어
│   ├── api/              # API 함수 [v0.5.0]
│   ├── hooks/            # 커스텀 훅 [v0.5.0]
│   └── utils.ts          # 헬퍼 함수
├── docs/                  # 문서
│   ├── 버전/             # 버전별 문서
│   └── 정리/             # 가이드 문서
├── public/                # 정적 파일
├── .env.local.example     # 환경 변수 템플릿 [v0.5.0]
├── .env.local            # 환경 변수 (Git 제외)
├── tailwind.config.ts    # Tailwind 설정
├── tsconfig.json         # TypeScript 설정
└── package.json          # 패키지 정보
```

---

## ⚙️ 설정 파일

### TypeScript (`tsconfig.json`)
- strict 모드 활성화
- path alias 설정 (`@/*`)
- App Router 지원

### Tailwind CSS (`tailwind.config.ts`)
- 다크 모드 지원 (`class` 전략)
- 커스텀 색상 시스템
- 애니메이션 설정

### Next.js (`next.config.js`)
- App Router 사용
- 이미지 최적화
- 환경 변수 설정

---

## 🔐 환경 변수 관리

### 파일 구조
- `.env.local.example`: 템플릿 (Git 포함)
- `.env.local`: 실제 값 (Git 제외)

### 보안 규칙
1. **절대 커밋하지 말 것**: `.env.local`
2. **공개 저장소 주의**: API 키 노출 방지
3. **환경별 분리**: 개발/프로덕션 환경 변수 분리

### 환경 변수 우선순위
1. `.env.local` (최우선)
2. `.env.development` (개발 모드)
3. `.env.production` (프로덕션 모드)
4. `.env` (기본)

---

## 🐛 문제 해결

### 설치 오류

#### "Cannot find module"
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

#### "Port 3000 already in use"
```bash
# 다른 포트 사용
PORT=3001 npm run dev
```

### 실행 오류

#### "Hydration failed"
- 브라우저 캐시 삭제
- 개발 서버 재시작
- `.next` 폴더 삭제 후 재빌드

#### "API 키가 설정되지 않았습니다"
- `.env.local` 파일 확인
- 환경 변수 이름 확인
- 서버 재시작 (환경 변수 변경 시 필수)

### 빌드 오류

#### TypeScript 오류
```bash
# 타입 체크
npx tsc --noEmit

# 자동 수정 가능한 오류 수정
npm run lint:fix
```

#### Tailwind CSS 오류
```bash
# Tailwind 재빌드
npx tailwindcss -i ./app/globals.css -o ./public/output.css
```

---

## 📊 개발 워크플로우

### 1. 기능 개발
```bash
# 1. 브랜치 생성
git checkout -b feature/new-feature

# 2. 개발 서버 실행
npm run dev

# 3. 코드 작성

# 4. 린트 체크
npm run lint

# 5. 커밋
git add .
git commit -m "feat: add new feature"
```

### 2. 테스트
```bash
# 타입 체크
npx tsc --noEmit

# 빌드 테스트
npm run build
npm start
```

### 3. 배포
```bash
# 프로덕션 빌드
npm run build

# 환경 변수 설정 (프로덕션)
# .env.production 파일 생성

# 배포 (Vercel, Netlify 등)
```

---

## 🚀 배포 가이드

### Vercel (권장)
1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포

### 환경 변수 설정 (Vercel)
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=...
NEXT_PUBLIC_NAVER_CLIENT_ID=...
NEXT_PUBLIC_NAVER_CLIENT_SECRET=...
```

### 기타 플랫폼
- **Netlify**: Next.js 플러그인 사용
- **AWS Amplify**: Next.js SSR 지원
- **Docker**: Dockerfile 작성 필요

---

## 📝 추가 리소스

### 공식 문서
- [Next.js 문서](https://nextjs.org/docs)
- [React 문서](https://react.dev)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Zustand 문서](https://docs.pmnd.rs/zustand)

### 프로젝트 문서
- [전체 기능 목록](./FEATURES.md)
- [API 설정 가이드](./API-SETUP.md)
- [v0.5.0 상세 문서](./버전/v0.5.0-summary.md)
- [학습 경로 가이드](./정리/learning-path.md)

---

## 💡 팁

### 개발 효율성
1. **Hot Reload**: 코드 저장 시 자동 새로고침
2. **Fast Refresh**: React 상태 유지하며 업데이트
3. **TypeScript**: 자동 완성 및 타입 체크

### 디버깅
1. **React DevTools**: 컴포넌트 트리 확인
2. **Redux DevTools**: Zustand 상태 확인
3. **Network Tab**: API 호출 확인

### 성능
1. **빌드 분석**: `npm run build` 후 번들 크기 확인
2. **Lighthouse**: 성능 측정
3. **Next.js Analytics**: Vercel에서 제공

---

## 🎯 다음 단계

1. ✅ 프로젝트 설치 완료
2. ✅ 개발 서버 실행
3. 📚 [전체 기능 목록](./FEATURES.md) 확인
4. 🔑 [API 설정](./API-SETUP.md) (선택)
5. 💻 코드 작성 시작!

---

**설치 완료!** 🎉

이제 http://localhost:3000에서 프로젝트를 확인할 수 있습니다.
