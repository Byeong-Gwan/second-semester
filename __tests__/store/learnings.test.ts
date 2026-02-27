import { describe, it, expect, beforeEach } from 'vitest'
import { useLearningStore } from '@/lib/store/learnings'

describe('Learning Store', () => {
  beforeEach(() => {
    useLearningStore.setState({ learnings: [] })
  })

  it('초기 상태: 빈 배열', () => {
    const { learnings } = useLearningStore.getState()
    expect(learnings).toEqual([])
  })

  it('학습 항목 추가', () => {
    const { addLearning } = useLearningStore.getState()
    addLearning('TypeScript 기초')

    const { learnings } = useLearningStore.getState()
    expect(learnings).toHaveLength(1)
    expect(learnings[0].title).toBe('TypeScript 기초')
    expect(learnings[0].joined).toBe(true)
  })

  it('학습 항목 삭제', () => {
    const { addLearning } = useLearningStore.getState()
    addLearning('삭제할 학습')

    const id = useLearningStore.getState().learnings[0].id
    useLearningStore.getState().removeLearning(id)

    const { learnings } = useLearningStore.getState()
    expect(learnings).toHaveLength(0)
  })

  it('학습 참여 토글', () => {
    const { addLearning } = useLearningStore.getState()
    addLearning('토글 테스트')

    const id = useLearningStore.getState().learnings[0].id

    // 참여중 → 미참여
    useLearningStore.getState().toggleJoined(id)
    expect(useLearningStore.getState().learnings[0].joined).toBe(false)

    // 미참여 → 참여중
    useLearningStore.getState().toggleJoined(id)
    expect(useLearningStore.getState().learnings[0].joined).toBe(true)
  })
})
