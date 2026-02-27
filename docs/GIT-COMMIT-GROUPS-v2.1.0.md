# Git 커밋 파일 그룹화 가이드 - v2.1.0

---

## 🎯 추천 커밋 그룹 (4단계)

### 1단계: 핵심 구조 변경 (가장 중요)
```bash
# 네비게이션 + 레이아웃 개편
git add app/layout.tsx
git add components/AppHeader.tsx
git add components/BottomNav.tsx
git commit -m "feat: 네비게이션 구조 완전 재설계

- 상단 6메뉴 → 하단 4탭 (오늘|활동|일상|설정)
- AppHeader + BottomNav 컴포넌트 신규
- 모바일 우선 디자인 적용
- safe-area-bottom 지원

주요 변경사항: 네비게이션 구조 완전 변경"
```

### 2단계: 페이지 구조 개편
```bash
# 메인 페이지 + 활동 페이지
git add app/page.tsx
git add app/activity/page.tsx
git add app/activity/_tabs/LearningTab.tsx
git add app/activity/_tabs/TodosTab.tsx
git add app/activity/_tabs/AttendanceTab.tsx
git add app/activity/_tabs/ReflectionTab.tsx
git add app/activity/_tabs/StudyLogTab.tsx
git commit -m "feat: 페이지 구조 재설계 및 활동 페이지 통합

- 메인 페이지: 대시보드 → 오늘의 요약
- 활동 페이지: 5탭 통합 (학습/할일/출석/회고/일지)
- 각 탭별 CRUD 모달 구현
- 반응형 탭 디자인"
```

### 3단계: 신규 기능 페이지
```bash
# 일상 + 설정 페이지
git add app/daily/page.tsx
git add app/settings/page.tsx
git commit -m "feat: 일상 및 설정 페이지 신규 구현

- 일상 페이지: 날씨 요약 + 뉴스 페이징
- 설정 페이지: 테마 전환 + 데이터 백업/복원/삭제
- 모바일 페이징 시스템 구현
- 데이터 관리 기능 완성"
```

### 4단계: API 및 스토어 개선
```bash
# API + 스토어 + 뉴스 시스템
git add app/api/news/route.ts
git add app/news/page.tsx
git add lib/store/learnings.ts
git add app/globals.css
git commit -m "feat: API 연동 및 스토어 개선

- 뉴스 API: 5개 → 100개 데이터 가져오기
- 뉴스 페이지: 실시간 API 연동 + 페이징
- learnings 스토어: updateLearning 메서드 추가
- CSS 유틸리티: no-scrollbar, safe-area-bottom"
```

### 5단계: 링크 업데이트 및 마무리
```bash
# 내부 링크 업데이트
git add app/dashboard/page.tsx
git add app/mypage/learning/[id]/page.tsx
git commit -m "fix: 내부 링크 새 구조로 업데이트

- 대시보드 링크: /mypage/* → /activity?tab=*
- 학습 상세 뒤로가기 수정
- 새 네비게이션과 호환성 보장"
```

---

## 🔄 한 번에 커밋하는 경우 (간단 버전)

```bash
# 모든 변경사항 한 번에 커밋
git add .
git commit -m "feat: UX/UI 완전 개편 v2.1.0 구현

- 🔄 네비게이션 재설계: 상단 6메뉴 → 하단 4탭 (오늘|활동|일상|설정)
- 📱 모바일 우선 디자인 (44px 터치 타겟, safe-area 지원)
- 🏠 메인 페이지: 대시보드 → 오늘의 요약 (핵심 지표 + 날씨/뉴스)
- 📚 활동 페이지: 5탭 통합 (학습/할일/출석/회고/일지) + CRUD 모달
- ⚙️ 설정 페이지: 테마 전환 + 데이터 백업/복원/삭제
- 🌤️ 일상 페이지: 날씨 요약 + 뉴스 모바일 페이징
- 📰 뉴스 시스템: 네이버 API 연동 (100개 + 모바일 5개 페이징)
- 🎨 CSS 유틸리티: 스크롤바 제거, safe-area, 모달 애니메이션

주요 변경사항: 네비게이션 구조 완전 재설계 및 모바일 우선 전환"
```

---

## 📁 파일별 커밋 그룹 상세

### 🏗️ 구조 기반 그룹화

#### 1. 핵심 구조 (3개 파일)
```
app/layout.tsx              # 레이아웃 재설계
components/AppHeader.tsx    # 심플 헤더
components/BottomNav.tsx    # 하단 네비게이션
```

#### 2. 페이지 구조 (7개 파일)
```
app/page.tsx                           # 오늘의 요약
app/activity/page.tsx                  # 활동 통합
app/activity/_tabs/LearningTab.tsx     # 학습 CRUD
app/activity/_tabs/TodosTab.tsx        # 할 일 CRUD
app/activity/_tabs/AttendanceTab.tsx  # 출석 관리
app/activity/_tabs/ReflectionTab.tsx   # 회고 CRUD
app/activity/_tabs/StudyLogTab.tsx     # 학습 일지
```

#### 3. 신규 기능 (2개 파일)
```
app/daily/page.tsx         # 일상 페이지
app/settings/page.tsx      # 설정 페이지
```

#### 4. API 및 스토어 (4개 파일)
```
app/api/news/route.ts      # 뉴스 API 개선
app/news/page.tsx          # 뉴스 페이지 API 연동
lib/store/learnings.ts     # 스토어 CRUD 메서드
app/globals.css            # CSS 유틸리티
```

#### 5. 링크 업데이트 (2개 파일)
```
app/dashboard/page.tsx              # 대시보드 링크
app/mypage/learning/[id]/page.tsx  # 학습 상세 링크
```

---

## 🎯 기능별 커밋 그룹화

### 네비게이션 그룹
```bash
git add app/layout.tsx components/AppHeader.tsx components/BottomNav.tsx
git commit -m "feat: 하단 4탭 네비게이션 구현"
```

### CRUD 그룹
```bash
git add app/activity/_tabs/LearningTab.tsx
git add app/activity/_tabs/TodosTab.tsx
git add app/activity/_tabs/AttendanceTab.tsx
git add app/activity/_tabs/ReflectionTab.tsx
git add lib/store/learnings.ts
git commit -m "feat: 전체 CRUD 기능 모달로 구현"
```

### 뉴스 그룹
```bash
git add app/api/news/route.ts app/news/page.tsx app/daily/page.tsx
git commit -m "feat: 네이버 API 연동 및 페이징 시스템"
```

### 모바일 그룹
```bash
git add app/globals.css components/BottomNav.tsx app/activity/page.tsx
git commit -m "feat: 모바일 우선 디자인 최적화"
```

---

## 🚀 추천 커밋 전략

### 전략 1: 기능 중심 (추천)
- 각 기능 단위로 커밋
- 코드 리뷰 용이
- 롤백 편리

### 전략 2: 구조 중심
- 구조 변경부터 순서대로
- 빌드 오류 방지
- 안정적인 배포

### 전략 3: 한 번에 커밋
- 간단하고 빠름
- 하나의 기능으로 묶임
- 대규모 변경에 적합

---

## ⚠️ 커밋 주의사항

### 1. 빌드 오류 방지
```bash
# 각 커밋 후 빌드 테스트
npm run build
```

### 2. 파일 의존성 고려
- `layout.tsx` 먼저 커밋
- 스토어 변경 후 컴포넌트 커밋
- API 변경 후 프론트 커밋

### 3. 커밋 메시지 일관성
- 같은 타입 사용
- 명확한 범위 지정
- 상세한 변경 내용

---

## 🎯 최종 추천 순서

```bash
# 1. 구조 기반 순서대로 커밋 (가장 안정적)

git add app/layout.tsx components/AppHeader.tsx components/BottomNav.tsx
git commit -m "feat: 네비게이션 구조 완전 재설계"

git add app/page.tsx app/activity/page.tsx app/activity/_tabs/
git commit -m "feat: 페이지 구조 재설계 및 활동 페이지 통합"

git add app/daily/page.tsx app/settings/page.tsx
git commit -m "feat: 일상 및 설정 페이지 신규 구현"

git add app/api/news/route.ts app/news/page.tsx lib/store/learnings.ts app/globals.css
git commit -m "feat: API 연동 및 스토어 개선"

git add app/dashboard/page.tsx app/mypage/learning/[id]/page.tsx
git commit -m "fix: 내부 링크 새 구조로 업데이트"
```

---

*이 가이드는 Second Semester v2.1.0 개편의 안정적인 커밋을 위해 파일 그룹화 전략을 제공합니다.*
