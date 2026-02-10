# API 설정 가이드

실제 날씨와 뉴스 데이터를 보려면 API 키를 설정해야 합니다.

---

## 🚀 빠른 시작 (5분)

### 1. 환경 변수 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
cp .env.local.example .env.local
```

### 2. API 키 발급 및 설정

아래 두 가지 API 키를 발급받아 `.env.local` 파일에 입력하세요.

---

## ☁️ OpenWeatherMap API (날씨)

### 가입 및 API 키 발급

1. **가입**: https://openweathermap.org/api
2. **로그인** 후 "API keys" 메뉴로 이동
3. **API 키 복사** (자동으로 생성되어 있음)
4. `.env.local`에 추가:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### 무료 플랜
- ✅ 하루 1,000개 요청
- ✅ 현재 날씨 + 5일 예보
- ✅ 저작권 문제 없음

### 예상 소요 시간
⏱️ **2분**

---

## 📰 네이버 뉴스 검색 API

### 가입 및 API 키 발급

1. **가입**: https://developers.naver.com
2. **애플리케이션 등록**:
   - 상단 메뉴 "Application" → "애플리케이션 등록"
   - 애플리케이션 이름: `second-semester` (원하는 이름)
   - 사용 API: **검색** 선택
   - 환경 추가: **WEB 설정** → `http://localhost:3000`

3. **Client ID와 Client Secret 복사**

4. `.env.local`에 추가:

```env
NEXT_PUBLIC_NAVER_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_client_secret_here
```

### 무료 플랜
- ✅ 하루 25,000개 요청
- ✅ 제목 + 요약 제공
- ✅ 저작권 문제 없음

### 예상 소요 시간
⏱️ **3분**

---

## 📝 최종 .env.local 파일 예시

```env
# OpenWeatherMap API
NEXT_PUBLIC_OPENWEATHER_API_KEY=abc123def456ghi789

# 네이버 검색 API
NEXT_PUBLIC_NAVER_CLIENT_ID=xyz789abc123
NEXT_PUBLIC_NAVER_CLIENT_SECRET=def456ghi789jkl012
```

---

## 🔄 개발 서버 재시작

환경 변수를 설정한 후 **개발 서버를 재시작**하세요:

```bash
# 서버 중지 (Ctrl + C)
# 서버 재시작
npm run dev
```

---

## ✅ 확인 방법

1. 브라우저에서 http://localhost:3000/weather 접속
2. 실제 날씨 데이터가 표시되는지 확인
3. 실제 뉴스가 표시되는지 확인

---

## ⚠️ 문제 해결

### API 키가 작동하지 않을 때

1. **환경 변수 확인**:
   - `.env.local` 파일이 프로젝트 루트에 있는지 확인
   - 파일 이름이 정확한지 확인 (`.env.local.example` 아님)

2. **서버 재시작**:
   - 환경 변수 변경 후 반드시 서버 재시작 필요

3. **API 키 확인**:
   - 복사할 때 공백이 들어가지 않았는지 확인
   - 따옴표 없이 값만 입력

### 에러 메시지별 해결 방법

#### "API 키가 설정되지 않았습니다"
→ `.env.local` 파일을 확인하고 서버를 재시작하세요.

#### "날씨 데이터를 가져올 수 없습니다"
→ OpenWeatherMap API 키가 올바른지 확인하세요.

#### "뉴스를 가져올 수 없습니다"
→ 네이버 Client ID와 Secret이 올바른지 확인하세요.

---

## 💡 참고사항

### API 키 보안
- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 이미 추가되어 있습니다

### API 사용량
- OpenWeatherMap: 하루 1,000개 (충분함)
- 네이버: 하루 25,000개 (매우 충분함)

### 목 데이터 사용
- API 키가 없어도 앱은 작동합니다
- 샘플 데이터가 자동으로 표시됩니다

---

## 🎯 완료!

API 키 설정이 완료되면 실시간 날씨와 뉴스를 확인할 수 있습니다! 🎉
