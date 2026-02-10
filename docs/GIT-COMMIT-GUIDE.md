# Git 커밋 가이드 - v0.5.0

---

## 📦 커밋할 파일 목록

### 신규 파일 (11개)

#### 페이지 & API
```bash
app/weather/page.tsx
app/api/weather/route.ts
app/api/news/route.ts
```

#### 라이브러리
```bash
lib/api/weather.ts
lib/api/news.ts
lib/hooks/useMediaQuery.ts
```

#### 컴포넌트
```bash
components/ui/button.tsx
```

#### 설정 & 문서
```bash
.env.local.example
docs/API-SETUP.md
docs/FEATURES.md
docs/INSTALLATION.md
docs/PROJECT-STATUS.md
docs/GIT-COMMIT-GUIDE.md
docs/버전/v0.5.0-summary.md
```

### 수정된 파일 (2개)
```bash
app/layout.tsx
README.md
```

---

## 🎯 Git 커밋 명령어

### 1단계: 파일 스테이징

```bash
# 신규 파일 추가
git add app/weather/page.tsx
git add app/api/weather/route.ts
git add app/api/news/route.ts
git add lib/api/weather.ts
git add lib/api/news.ts
git add lib/hooks/useMediaQuery.ts
git add components/ui/button.tsx
git add .env.local.example
git add docs/API-SETUP.md
git add docs/FEATURES.md
git add docs/INSTALLATION.md
git add docs/PROJECT-STATUS.md
git add docs/GIT-COMMIT-GUIDE.md
git add "docs/버전/v0.5.0-summary.md"

# 수정된 파일 추가
git add app/layout.tsx
git add README.md
```

### 또는 한 번에 추가
```bash
git add app/weather/page.tsx app/api/weather/route.ts app/api/news/route.ts \
        lib/api/weather.ts lib/api/news.ts lib/hooks/useMediaQuery.ts \
        components/ui/button.tsx .env.local.example \
        docs/API-SETUP.md docs/FEATURES.md docs/INSTALLATION.md \
        docs/PROJECT-STATUS.md docs/GIT-COMMIT-GUIDE.md \
        "docs/버전/v0.5.0-summary.md" \
        app/layout.tsx README.md
```

### 2단계: 커밋

```bash
git commit -m "feat: 일상 정보 페이지 추가 (날씨 + 뉴스 통합) - v0.5.0

✨ 새로운 기능
- 실시간 날씨 정보 (OpenWeatherMap API)
  - 현재 날씨 (온도, 습도, 풍속, 기압, 가시거리)
  - 7일 예보 (최저/최고 온도, 날씨 상태)
- 실시간 뉴스 정보 (네이버 뉴스 API)
  - 주요 뉴스 20개
  - HTML 태그 자동 제거
  - 제목, 요약, 링크, 발행 시간
- 반응형 페이지네이션
  - 모바일: 더보기 버튼 (5개씩 추가)
  - 웹: 페이지 버튼 (1, 2, 3, ...)

🔧 기술 개선
- Next.js API Routes로 CORS 문제 해결
- 환경 변수로 API 키 안전 관리
- 미디어 쿼리 훅 추가 (useMediaQuery, useIsMobile)
- Button 컴포넌트 추가

📝 문서화
- v0.5.0 상세 문서
- API 설정 가이드
- 전체 기능 목록
- 설치 가이드
- 프로젝트 현황 분석
- README 업데이트

🐛 버그 수정
- 뉴스 제목의 HTML 태그 제거
- 환경 변수 로드 문제 해결

📦 신규 파일 (11개)
- app/weather/page.tsx
- app/api/weather/route.ts
- app/api/news/route.ts
- lib/api/weather.ts
- lib/api/news.ts
- lib/hooks/useMediaQuery.ts
- components/ui/button.tsx
- .env.local.example
- docs/API-SETUP.md
- docs/FEATURES.md
- docs/INSTALLATION.md
- docs/PROJECT-STATUS.md
- docs/GIT-COMMIT-GUIDE.md
- docs/버전/v0.5.0-summary.md

🔄 수정된 파일 (2개)
- app/layout.tsx (헤더 메뉴 이름 변경)
- README.md (v0.5.0 내용 추가)

Breaking Changes: 없음
Migration Guide: docs/API-SETUP.md 참고"
```

### 3단계: 푸시

```bash
# 메인 브랜치에 푸시
git push origin main

# 또는 다른 브랜치
git push origin feature/weather-news
```

---

## 📋 커밋 메시지 템플릿 (간단 버전)

```bash
git commit -m "feat: 일상 정보 페이지 (날씨 + 뉴스) - v0.5.0

- 실시간 날씨 정보 (OpenWeatherMap API)
- 실시간 뉴스 정보 (네이버 뉴스 API)
- 반응형 페이지네이션 (모바일/웹)
- API 연동 및 문서화 완료

신규 파일: 11개
수정 파일: 2개"
```

---

## 🔍 커밋 전 체크리스트

### 필수 확인 사항
- [ ] `.env.local` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] API 키가 코드에 하드코딩되지 않았는지 확인
- [ ] 모든 파일이 정상 작동하는지 테스트
- [ ] 린트 에러가 없는지 확인 (`npm run lint`)
- [ ] 빌드가 성공하는지 확인 (`npm run build`)

### 확인 명령어
```bash
# 린트 체크
npm run lint

# 빌드 테스트
npm run build

# Git 상태 확인
git status

# 변경 사항 확인
git diff

# 스테이징된 파일 확인
git diff --staged
```

---

## 🚫 커밋하지 말아야 할 파일

```bash
# 절대 커밋하지 말 것!
.env.local          # 실제 API 키 포함
.env               # 환경 변수
node_modules/      # 의존성
.next/             # 빌드 파일
.DS_Store          # macOS 시스템 파일
*.log              # 로그 파일
```

### .gitignore 확인
```bash
# .gitignore 파일 확인
cat .gitignore

# 무시되는 파일 확인
git status --ignored
```

---

## 📝 커밋 메시지 규칙

### 타입
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드/설정 변경

### 형식
```
<타입>: <제목> - <버전>

<본문>

<푸터>
```

### 예시
```bash
feat: 날씨 API 연동 - v0.5.0

OpenWeatherMap API를 사용하여 실시간 날씨 정보를 표시합니다.

- 현재 날씨 표시
- 7일 예보 표시
- 날씨 아이콘 추가

Closes #123
```

---

## 🔄 브랜치 전략

### 권장 브랜치 구조
```
main (또는 master)     # 프로덕션
└── develop            # 개발
    └── feature/weather-news  # 기능 개발
```

### 브랜치 생성
```bash
# 기능 브랜치 생성
git checkout -b feature/weather-news

# 작업 후 커밋
git add .
git commit -m "feat: ..."

# develop에 머지
git checkout develop
git merge feature/weather-news

# main에 머지
git checkout main
git merge develop
```

---

## 🏷️ 태그 생성

### v0.5.0 태그
```bash
# 태그 생성
git tag -a v0.5.0 -m "Release v0.5.0 - 일상 정보 페이지 추가

- 날씨 정보 (OpenWeatherMap API)
- 뉴스 정보 (네이버 뉴스 API)
- 반응형 페이지네이션
- 문서화 완료"

# 태그 푸시
git push origin v0.5.0

# 모든 태그 푸시
git push origin --tags
```

### 태그 확인
```bash
# 태그 목록
git tag

# 태그 상세 정보
git show v0.5.0
```

---

## 📤 GitHub에 올리기

### 1. 원격 저장소 설정 (처음만)
```bash
# 원격 저장소 추가
git remote add origin https://github.com/username/second-semester.git

# 원격 저장소 확인
git remote -v
```

### 2. 푸시
```bash
# 첫 푸시
git push -u origin main

# 이후 푸시
git push
```

### 3. GitHub에서 확인
1. https://github.com/username/second-semester 접속
2. 커밋 내역 확인
3. 파일 변경 사항 확인
4. Release 생성 (선택)

---

## 🎯 Release 생성 (GitHub)

### GitHub Release 만들기
1. GitHub 저장소 → Releases → "Create a new release"
2. Tag: `v0.5.0`
3. Title: `v0.5.0 - 일상 정보 페이지`
4. Description:
```markdown
## 🎉 v0.5.0 - 일상 정보 페이지 (날씨 + 뉴스 통합)

### ✨ 새로운 기능
- **실시간 날씨 정보** (OpenWeatherMap API)
  - 현재 날씨 (온도, 습도, 풍속, 기압, 가시거리)
  - 7일 예보 (최저/최고 온도, 날씨 상태)
- **실시간 뉴스 정보** (네이버 뉴스 API)
  - 주요 뉴스 20개
  - HTML 태그 자동 제거
- **반응형 페이지네이션**
  - 모바일: 더보기 버튼
  - 웹: 페이지 버튼

### 🔧 기술 개선
- Next.js API Routes로 CORS 문제 해결
- 환경 변수로 API 키 안전 관리
- 미디어 쿼리 훅 추가

### 📝 문서화
- [API 설정 가이드](./docs/API-SETUP.md)
- [전체 기능 목록](./docs/FEATURES.md)
- [설치 가이드](./docs/INSTALLATION.md)
- [프로젝트 현황](./docs/PROJECT-STATUS.md)

### 📦 변경 사항
- 신규 파일: 11개
- 수정 파일: 2개

### 🚀 설치 방법
```bash
git clone https://github.com/username/second-semester.git
cd second-semester
npm install
cp .env.local.example .env.local
# .env.local에 API 키 입력
npm run dev
```

자세한 내용은 [v0.5.0 문서](./docs/버전/v0.5.0-summary.md)를 참고하세요.
```

---

## 🎨 README 배지 추가 (선택)

```markdown
# Second Semester

![Version](https://img.shields.io/badge/version-0.5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

어두운 테마를 기본으로 하는 학기별 스터디 플래너 대시보드입니다.
```

---

## ✅ 최종 체크리스트

### 커밋 전
- [ ] 모든 파일 저장
- [ ] 린트 에러 없음
- [ ] 빌드 성공
- [ ] `.env.local` 제외 확인
- [ ] API 키 하드코딩 없음

### 커밋 후
- [ ] 커밋 메시지 확인
- [ ] 파일 목록 확인
- [ ] 원격 저장소 푸시
- [ ] GitHub에서 확인

### 배포 전
- [ ] 환경 변수 설정 (Vercel)
- [ ] 빌드 테스트
- [ ] 도메인 설정 (선택)
- [ ] Analytics 설정 (선택)

---

## 🚀 다음 단계

1. ✅ Git 커밋 완료
2. ✅ GitHub 푸시
3. 📦 Vercel 배포
4. 🌐 도메인 연결 (선택)
5. 📊 Analytics 설정
6. 🎯 사용자 피드백 수집

---

**커밋 준비 완료!** 🎉

위의 명령어를 순서대로 실행하면 됩니다.
