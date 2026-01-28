# 문제 발생 시 해결 노력 요약

- **date-fns 로케일 import 오류**
  - 증상: “Module ... has no default export” 에러.
  - 원인: date-fns v3부터 로케일이 기본 내보내기(default export)가 아니라 named export로 변경.
  - 시도/해결:
    - `import ko from "date-fns/locale/ko"` → `import { ko } from "date-fns/locale"` 로 수정.
    - 한국어 날짜 포맷 사용 부분은 동일하게 유지(`format(..., { locale: ko })`).

- **Hydration(수화) 오류 및 경고**
  - 증상:
    - “Expected server HTML to contain a matching <path> in <svg>”
    - “Hydration failed because the initial UI does not match what was rendered on the server.”
  - 원인:
    - next-themes 사용 시 SSR 단계에서 테마가 확정되지 않아, 클라이언트에서 실제 테마가 반영되며 아이콘/텍스트가 달라져 SSR/CSR 불일치가 발생.
    - 특히 `ThemeToggle`에서 라이트/다크 아이콘을 조건부로 렌더링하며 `<svg>` 내부 구조가 달라지는 문제가 대표적.
  - 시도/해결:
    - `ThemeToggle`에서 마운트 전에는 placeholder를 렌더하고, 마운트 후에만 `resolvedTheme` 기반으로 실제 아이콘/텍스트 렌더.
    - 버튼에 `suppressHydrationWarning` 적용.
    - `ThemeProvider`의 `defaultTheme="system"` 설정으로 초기 SSR/CSR 불일치 최소화.
  - 대안(필요 시):
    - `ThemeToggle`를 동적 import(`ssr: false`)로 처리해 SSR에서 제외.

# 리팩토링 목표 및 기대 효과

- **SSR/CSR 일관성 확보**
  - 초기 렌더 시점에 서버와 클라이언트가 다른 UI를 만들지 않도록 가드(마운트 후 렌더, placeholder, suppressHydrationWarning) 적용.
  - 결과: 콘솔 경고/에러 제거, 초기 깜빡임(Flicker) 최소화, 안정적 Fast Refresh.

- **의존성 버전 변화에 유연한 코드**
  - date-fns v3 API 변경 반영(named export), import 경로를 명확히하여 버전 업그레이드 시 리스크 감소.

- **구성 명확화 및 유지보수성 향상**
  - 테마 로직을 `Providers`와 `ThemeToggle`로 분리하고 책임을 명확히 함.
  - UI 상태(테마) 의존 렌더링에서 SSR 안전장치 표준화(마운트 체크).

- **사용자 경험 개선**
  - 다크/라이트 테마 전환의 자연스러운 반영.
  - D-DAY/진행률/할 일 등 핵심 정보가 한 화면에서 안정적으로 노출.

# 현재 프로젝트 환경을 선택한 이유

- **Next.js 14 (App Router)**
  - 파일 기반 라우팅, 서버 컴포넌트 지원, SEO·퍼포먼스에 유리.
  - `metadata`, 레이아웃/중첩 레이아웃, 스트리밍 등 최신 기능으로 확장성 확보.

- **React 18**
  - Concurrent Rendering 기반으로 인터랙션 성능 및 사용자 경험 개선.
  - 서버와의 경계(서버 컴포넌트/클라이언트 컴포넌트) 명확화로 성능 최적화.

- **Tailwind CSS + shadcn/ui**
  - 빠른 스타일링과 일관된 디자인 시스템 구축.
  - 접근성/상태/애니메이션까지 고려된 컴포넌트로 개발 생산성 향상.

- **next-themes**
  - 시스템 테마 연동과 클래스 기반 토글로 구현이 간단하고 SSR 환경에서도 비교적 안전.
  - 사용자 취향(라이트/다크/시스템)에 맞춘 경험 제공.

- **date-fns**
  - 가벼운 날짜 유틸리티, 트리 셰이킹에 유리.
  - 한국어 로케일 지원으로 자연스러운 날짜 표기.

- **lucide-react**
  - 심플하고 일관된 SVG 아이콘 세트.
  - Tailwind와 잘 맞고 커스터마이징 용이.

# 향후 개선 아이디어

- **테마 토글 동적 import**: 마운트 전 렌더를 완전히 차단하여 초기 불일치 가능성 0에 가깝게.
- **유닛/통합 테스트 도입**: SSR/CSR 경계에서의 조건부 렌더링 테스트 추가.
- **상태 관리 정리**: 카드 간 공통 상태(할 일 등)를 분리(store)하고 샘플 데이터 → 실제 API로 이행.
