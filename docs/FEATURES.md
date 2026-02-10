# 전체 기능 목록

Second Semester 프로젝트의 모든 기능을 정리한 문서입니다.

---

## 📚 학습 관리

### 학습 생성
- 제목 입력
- 시작일/종료일 설정
- 자동 ID 생성
- localStorage 자동 저장

### 학습 목록
- 모든 학습 카드 표시
- 기간 정보 표시 (시작일 ~ 종료일)
- 진척도 표시 (Progress Bar)
- 학습 상세 페이지 링크

### 학습 상세
- 진척도 조절 (Slider)
- 참여 상태 토글 (활성/비활성)
- 기간 정보 표시
- 학습 삭제 기능
- 즉시 반응하는 UI

---

## ✅ 할 일 관리

### 월간 달력
- 년도/월 선택 드롭다운
- 달력 그리드 (7x6)
- 오늘 날짜 강조
- 날짜 hover 시 + 버튼 표시
- 날짜별 할 일 개수 표시

### 할 일 목록
- 제목, 우선순위, 상태, 날짜 표시
- 체크박스로 완료 토글
- 우선순위별 색상 (높음: 빨강, 중간: 노랑, 낮음: 회색)
- 완료율 표시

### 필터링
- 상태별 필터 (전체/미완료/완료)
- 우선순위별 필터 (전체/높음/중간/낮음)
- 검색 기능 (제목 검색)

### 정렬
- 날짜순 (오름차순/내림차순)
- 우선순위순 (높음 → 낮음)
- 상태순 (미완료 → 완료)

### 할 일 추가
- 제목 입력
- 날짜 선택
- 우선순위 선택 (높음/중간/낮음)
- 빠른 추가 (달력에서 날짜 클릭)

---

## 📅 타임라인 (주간 스케줄)

### 주간 뷰
- 7일 세로 뷰
- 월/일자 선택 드롭다운
- 날짜별 할 일 표시
- 날짜별 완료 통계

### 할 일 통합
- 할 일 페이지와 데이터 공유
- 체크박스로 완료 토글
- 우선순위별 색상

### 빠른 추가
- 날짜별 + 버튼
- 해당 날짜로 자동 설정

---

## ☁️📰 일상 정보 (날씨 + 뉴스) **[v0.5.0]**

### 날씨 정보
**현재 날씨**:
- 온도 (°C)
- 체감온도 (°C)
- 습도 (%)
- 풍속 (m/s)
- 기압 (hPa)
- 가시거리 (km)
- 날씨 설명

**7일 예보**:
- 날짜
- 최저/최고 온도
- 날씨 상태
- 아이콘 (맑음, 흐림, 비, 눈)

**API**:
- OpenWeatherMap API
- 서울 기준
- 실시간 업데이트

### 뉴스 정보
**뉴스 카드**:
- 제목
- 요약 (description)
- 발행 시간 ("2시간 전" 형식)
- 외부 링크

**기능**:
- 주요 뉴스 20개
- HTML 태그 자동 제거
- 클릭 시 원문 링크 열기

**API**:
- 네이버 뉴스 검색 API
- 최신순 정렬
- 실시간 업데이트

### 페이지네이션
**모바일 (768px 이하)**:
- 처음 5개 표시
- 더보기 버튼
- 클릭 시 5개씩 추가
- 남은 개수 표시

**웹 (768px 초과)**:
- 페이지당 5개
- 숫자 버튼 (1, 2, 3, ...)
- 이전/다음 버튼
- 현재 페이지 강조
- 페이지 전환 시 자동 스크롤

---

## 🎨 UI/UX

### 테마
- 다크 모드 (기본)
- 라이트 모드
- 시스템 설정 자동 감지
- 테마 토글 버튼

### 반응형 디자인
- 모바일 (< 768px)
- 태블릿 (768px ~ 1024px)
- 데스크톱 (> 1024px)
- 자동 레이아웃 조정

### 색상 시스템
**우선순위**:
- 높음: 빨강 (red)
- 중간: 노랑 (yellow)
- 낮음: 회색 (gray)

**상태**:
- 완료: 초록 (green)
- 미완료: 기본 색상

**날씨**:
- 맑음: 노랑 (yellow)
- 흐림: 회색 (gray)
- 비: 파랑 (blue)
- 눈: 연한 파랑 (light blue)

### 아이콘
- lucide-react 사용
- 일관된 크기 (16px, 20px, 24px)
- 의미 있는 아이콘 선택

### 애니메이션
- hover 효과
- transition 적용
- 부드러운 전환
- 스켈레톤 로딩

---

## 🔧 기술 기능

### 상태 관리
- Zustand 사용
- localStorage 자동 저장 (persist)
- 3개 스토어 (learnings, todos, timeline)
- 타입 안전성 (TypeScript)

### API 연동 **[v0.5.0]**
- Next.js API Routes
- CORS 문제 해결
- 에러 처리
- 로딩 상태

### 데이터 영속성
- localStorage 사용
- 자동 저장/불러오기
- hydration 처리
- 데이터 무결성

### 타입 안전성
- TypeScript 사용
- 인터페이스 정의
- 타입 체크
- 자동 완성

---

## 🔐 보안

### API 키 관리 **[v0.5.0]**
- 환경 변수 사용
- `.env.local` 파일
- Git 커밋 제외 (`.gitignore`)
- 서버 사이드 호출

### CORS 처리 **[v0.5.0]**
- Next.js API Routes 프록시
- 브라우저 직접 호출 방지
- 안전한 API 호출

---

## 📊 데이터 구조

### Learning (학습)
```typescript
interface Learning {
  id: string;
  title: string;
  progress: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}
```

### Todo (할 일)
```typescript
interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  date: string;
}
```

### WeatherData (날씨) **[v0.5.0]**
```typescript
interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: { min: number; max: number };
    description: string;
    icon: string;
  }>;
}
```

### NewsItem (뉴스) **[v0.5.0]**
```typescript
interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}
```

---

## 🚀 성능 최적화

### API 호출
- `Promise.all()` 동시 로딩
- 불필요한 재호출 방지
- 에러 시 폴백

### 렌더링
- React.memo 사용 (필요 시)
- useMemo, useCallback 활용
- Controlled Components

### 로딩
- 스켈레톤 UI
- 로딩 상태 표시
- 부드러운 전환

---

## 📱 사용자 경험

### 즉시 반응
- 체크박스 즉시 반응
- 슬라이더 실시간 업데이트
- 토글 즉시 반영

### 직관적 UI
- 명확한 버튼 레이블
- 의미 있는 아이콘
- 일관된 디자인

### 에러 처리
- 명확한 에러 메시지
- 사용자 안내
- 복구 방법 제시

### 접근성
- 키보드 네비게이션
- 포커스 표시
- 의미 있는 HTML

---

## 🔄 데이터 흐름

### 학습 관리
```
사용자 입력 → Zustand 스토어 → localStorage → UI 업데이트
```

### 할 일 관리
```
사용자 입력 → Zustand 스토어 → localStorage → UI 업데이트
```

### 날씨 정보 **[v0.5.0]**
```
브라우저 → /api/weather → OpenWeatherMap → 파싱 → UI 표시
```

### 뉴스 정보 **[v0.5.0]**
```
브라우저 → /api/news → 네이버 API → HTML 제거 → UI 표시
```

---

## 📝 향후 계획

### 단기 (v0.6.0)
- [ ] 출석 관리 페이지
- [ ] 통계 대시보드 개선
- [ ] 위치 선택 기능 (날씨)
- [ ] 뉴스 카테고리 필터

### 중기 (v0.7.0)
- [ ] 반복 할 일
- [ ] 할 일 카테고리/태그
- [ ] 알림 기능
- [ ] 데이터 내보내기/가져오기

### 장기 (v1.0.0)
- [ ] 백엔드 연동
- [ ] 사용자 인증
- [ ] 멀티 디바이스 동기화
- [ ] PWA 지원

---

## 🎯 핵심 가치

1. **간결함**: 필요한 기능만 제공
2. **직관성**: 배우지 않아도 사용 가능
3. **반응성**: 즉시 반응하는 UI
4. **안정성**: 데이터 손실 방지
5. **확장성**: 쉽게 기능 추가 가능

---

## 📚 참고 문서

- [v0.5.0 상세 문서](./버전/v0.5.0-summary.md)
- [API 설정 가이드](./API-SETUP.md)
- [학습 경로 가이드](./정리/learning-path.md)
- [아키텍처 문서](./정리/architecture/)
