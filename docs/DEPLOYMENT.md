# 배포 가이드

## 🚀 Vercel 배포 (권장)

### 1단계: Vercel 계정 준비
1. [Vercel](https://vercel.com) 가입
2. GitHub 계정 연동

### 2단계: 프로젝트 배포
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3단계: 환경 변수 설정
Vercel 프로젝트 설정 > Environment Variables에서 추가:

```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key
NEXT_PUBLIC_NAVER_CLIENT_ID=your_client_id
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_client_secret
```

### 4단계: 배포 완료
- 자동으로 배포가 시작됩니다
- 배포 완료 후 제공되는 URL로 접속
- 커스텀 도메인 설정 가능 (선택)

---

## 📦 Netlify 배포 (대안)

### 1단계: Netlify 계정 준비
1. [Netlify](https://netlify.com) 가입
2. GitHub 계정 연동

### 2단계: 프로젝트 배포
1. "Add new site" > "Import an existing project"
2. GitHub 저장소 선택
3. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `.next`

### 3단계: 환경 변수 설정
Site settings > Environment variables에서 추가

---

## 🔧 배포 전 체크리스트

### 필수 항목
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 환경 변수가 배포 플랫폼에 설정되어 있는지 확인
- [ ] `npm run build` 로컬 빌드 테스트 완료
- [ ] API 키가 유효한지 확인

### 권장 항목
- [ ] 커스텀 도메인 설정
- [ ] HTTPS 활성화 (Vercel/Netlify는 자동)
- [ ] Google Analytics 설정
- [ ] 에러 추적 도구 설정 (Sentry 등)

---

## 🌐 도메인 연결 (선택)

### Vercel에서 커스텀 도메인 설정
1. 프로젝트 설정 > Domains
2. 도메인 입력 및 추가
3. DNS 설정 (도메인 제공업체에서)
   - A 레코드: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

---

## 📊 배포 후 모니터링

### Vercel Analytics
- 자동으로 활성화됨
- 페이지 뷰, 성능 지표 확인 가능

### Google Analytics 추가 (선택)
1. Google Analytics 계정 생성
2. 추적 ID 발급
3. `app/layout.tsx`에 스크립트 추가

---

## 🐛 문제 해결

### 빌드 실패
- 로컬에서 `npm run build` 실행하여 에러 확인
- 환경 변수가 올바르게 설정되었는지 확인
- Node.js 버전 확인 (18+ 권장)

### API 호출 실패
- 환경 변수가 프로덕션 환경에 설정되었는지 확인
- API 키가 유효한지 확인
- CORS 설정 확인

### 페이지 로딩 느림
- 이미지 최적화 확인
- 번들 크기 확인 (`npm run build` 출력 확인)
- CDN 캐싱 활용

---

## 📈 성능 최적화

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP/AVIF 포맷 자동 변환

### 코드 분할
- 동적 import 사용
- 라우트별 자동 코드 분할

### 캐싱
- Vercel Edge Network 자동 활용
- Static Generation 최대한 활용

---

## 🔄 업데이트 배포

### 자동 배포 (권장)
- GitHub에 push하면 자동으로 배포
- main 브랜치 → 프로덕션
- develop 브랜치 → 프리뷰 (선택)

### 수동 배포
- Vercel CLI 사용: `vercel --prod`
- Netlify CLI 사용: `netlify deploy --prod`

---

## 💰 비용

### Vercel (무료 플랜)
- 월 100GB 대역폭
- 무제한 배포
- 자동 HTTPS
- **충분함** ✅

### Netlify (무료 플랜)
- 월 100GB 대역폭
- 300분 빌드 시간
- 자동 HTTPS
- **충분함** ✅

---

## 📞 지원

문제가 발생하면:
1. [Vercel 문서](https://vercel.com/docs)
2. [Next.js 문서](https://nextjs.org/docs)
3. GitHub Issues
