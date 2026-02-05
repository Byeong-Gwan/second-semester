# 2026-02-02 커밋 메시지

## 파일별 그룹화된 커밋 메시지 (Conventional Commits)

### 1. Timeline 상세 페이지 구현
```bash
feat(timeline): implement timeline detail page with weekly view and modal

- Add /timeline page with weekly calendar view
- Implement timeline item CRUD operations (add, delete, toggle done)
- Add timeline creation modal with form validation
- Display all timeline items in sorted list view
- Add navigation controls (prev/next week, today button)
- Highlight current day with primary border
- Show timeline items grouped by day with type badges

Files:
- app/timeline/page.tsx (new)
```

### 2. Persist 미들웨어 적용
```bash
feat(store): add persist middleware to timeline and learnings stores

- Apply zustand persist middleware to timeline store
- Apply zustand persist middleware to learnings store
- Store data in localStorage with keys 'timeline-storage' and 'learnings-storage'
- Data persists across page refreshes

Files:
- lib/store/timeline.ts
- lib/store/learnings.ts
```

### 3. 타입별 색상 시스템 구현
```bash
feat(timeline): add type-based color system for timeline items

- Define color scheme for 5 timeline types (study, language, solo, project, etc)
- Add dark mode support for all type colors
- Apply consistent colors across timeline page and WeeklyTimelineCard
- Use color-coded badges to distinguish timeline item types

Color mapping:
- study: blue
- language: green
- solo: purple
- project: orange
- etc: gray

Files:
- app/timeline/page.tsx
- app/mypage/_components/WeeklyTimelineCard.tsx
```

### 4. WeeklyTimelineCard 개선
```bash
feat(timeline): enhance WeeklyTimelineCard with type badges and done state

- Add type-specific color badges to timeline items
- Display done state with strikethrough text
- Improve layout with time and type on same row
- Add visual distinction with type-based background colors
- Import Badge component from shadcn/ui

Files:
- app/mypage/_components/WeeklyTimelineCard.tsx
```

### 5. 학습 경로 문서 작성
```bash
docs: add comprehensive learning path guide

- Create learning path guide with 4-stage document reading order
- Add skill-level based study directions (beginner, intermediate, advanced)
- Suggest 4 practice projects with difficulty levels
- Include learning tips and checklist
- Provide recommended learning resources

Files:
- docs/정리/learning-path.md (new)
```

### 6. 작업 로그 문서화
```bash
docs: add worklog for 2026-02-02 timeline feature completion

- Document timeline feature implementation details
- Explain persist middleware integration
- Describe type-based color system
- Include technical details and code snippets
- Add "explain like I'm 5" section
- List next steps and improvement areas

Files:
- docs/정리/notes/2026-02-02-worklog.md (new)
- docs/정리/notes/2026-02-02-commit-messages.md (new)
```

---

## 통합 커밋 메시지 (한 번에 커밋하는 경우)

```bash
feat: complete timeline feature with persist and type-based colors

Major changes:
- Implement /timeline detail page with weekly view and CRUD operations
- Add persist middleware to timeline and learnings stores
- Introduce type-based color system (5 types with dark mode support)
- Enhance WeeklyTimelineCard with badges and done state
- Create comprehensive learning path documentation

New files:
- app/timeline/page.tsx
- docs/정리/learning-path.md
- docs/정리/notes/2026-02-02-worklog.md
- docs/정리/notes/2026-02-02-commit-messages.md

Modified files:
- lib/store/timeline.ts (persist)
- lib/store/learnings.ts (persist)
- app/mypage/_components/WeeklyTimelineCard.tsx (colors, badges)

BREAKING CHANGE: None
```

---

## 개별 커밋 순서 (권장)

작은 단위로 커밋하는 것을 선호한다면 다음 순서로 진행하세요:

1. **persist 미들웨어** (기반 작업)
   ```bash
   git add lib/store/timeline.ts lib/store/learnings.ts
   git commit -m "feat(store): add persist middleware to timeline and learnings stores"
   ```

2. **타입별 색상 시스템** (UI 개선)
   ```bash
   git add app/mypage/_components/WeeklyTimelineCard.tsx
   git commit -m "feat(timeline): add type-based color system and enhance WeeklyTimelineCard"
   ```

3. **timeline 페이지** (주요 기능)
   ```bash
   git add app/timeline/page.tsx
   git commit -m "feat(timeline): implement timeline detail page with weekly view and modal"
   ```

4. **문서화** (마무리)
   ```bash
   git add docs/정리/learning-path.md docs/정리/notes/2026-02-02-*.md
   git commit -m "docs: add learning path guide and worklog for timeline feature"
   ```

---

## Git 명령어 예시

### 전체 파일 확인
```bash
git status
```

### 변경 사항 확인
```bash
git diff
```

### 스테이징
```bash
# 개별 파일
git add app/timeline/page.tsx

# 패턴 매칭
git add lib/store/*.ts

# 전체
git add .
```

### 커밋
```bash
git commit -m "feat(timeline): implement timeline detail page"
```

### 푸시
```bash
git push origin main
```

---

## 커밋 메시지 작성 가이드

### Conventional Commits 형식
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- **feat**: 새로운 기능
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 포맷팅 (기능 변경 없음)
- **refactor**: 리팩토링
- **test**: 테스트 추가/수정
- **chore**: 빌드/설정 변경

### Scope (선택)
- timeline, store, ui, docs 등

### Subject
- 명령형 현재 시제 사용 ("add" not "added")
- 첫 글자 소문자
- 마침표 없음
- 50자 이내

### Body (선택)
- 무엇을, 왜 변경했는지 설명
- 72자마다 줄바꿈

### Footer (선택)
- BREAKING CHANGE: 호환성 깨지는 변경
- Closes #123: 이슈 종료
