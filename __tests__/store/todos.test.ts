import { describe, it, expect, beforeEach } from 'vitest'
import { useTodoStore } from '@/lib/store/todos'

describe('Todo Store', () => {
  beforeEach(() => {
    // 매 테스트 전 스토어 초기화
    useTodoStore.setState({ todos: [] })
  })

  it('초기 상태: 빈 배열', () => {
    const { todos } = useTodoStore.getState()
    expect(todos).toEqual([])
  })

  it('할 일 추가', () => {
    const { addTodo } = useTodoStore.getState()
    const id = addTodo('테스트 할 일')

    const { todos } = useTodoStore.getState()
    expect(todos).toHaveLength(1)
    expect(todos[0].title).toBe('테스트 할 일')
    expect(todos[0].completed).toBe(false)
    expect(todos[0].id).toBe(id)
  })

  it('할 일 추가 시 우선순위 기본값 medium', () => {
    const { addTodo } = useTodoStore.getState()
    addTodo('기본 우선순위')

    const { todos } = useTodoStore.getState()
    expect(todos[0].priority).toBe('medium')
  })

  it('할 일 추가 시 우선순위 지정', () => {
    const { addTodo } = useTodoStore.getState()
    addTodo('높은 우선순위', undefined, 'high')

    const { todos } = useTodoStore.getState()
    expect(todos[0].priority).toBe('high')
  })

  it('할 일 삭제', () => {
    const { addTodo } = useTodoStore.getState()
    const id = addTodo('삭제할 할 일')

    useTodoStore.getState().removeTodo(id)
    const { todos } = useTodoStore.getState()
    expect(todos).toHaveLength(0)
  })

  it('할 일 토글 (완료/미완료)', () => {
    const { addTodo } = useTodoStore.getState()
    const id = addTodo('토글 테스트')

    // 미완료 → 완료
    useTodoStore.getState().toggleTodo(id)
    expect(useTodoStore.getState().todos[0].completed).toBe(true)

    // 완료 → 미완료
    useTodoStore.getState().toggleTodo(id)
    expect(useTodoStore.getState().todos[0].completed).toBe(false)
  })

  it('할 일 수정', () => {
    const { addTodo } = useTodoStore.getState()
    const id = addTodo('수정 전')

    useTodoStore.getState().updateTodo(id, { title: '수정 후', priority: 'high' })
    const { todos } = useTodoStore.getState()
    expect(todos[0].title).toBe('수정 후')
    expect(todos[0].priority).toBe('high')
  })

  it('완료율 계산: 빈 배열이면 0', () => {
    const rate = useTodoStore.getState().getCompletionRate()
    expect(rate).toBe(0)
  })

  it('완료율 계산: 2개 중 1개 완료 = 50%', () => {
    const { addTodo } = useTodoStore.getState()
    const id1 = addTodo('할 일 1')
    addTodo('할 일 2')

    useTodoStore.getState().toggleTodo(id1)
    const rate = useTodoStore.getState().getCompletionRate()
    expect(rate).toBe(50)
  })

  it('완료율 계산: 전부 완료 = 100%', () => {
    const { addTodo } = useTodoStore.getState()
    const id1 = addTodo('할 일 1')
    const id2 = addTodo('할 일 2')

    useTodoStore.getState().toggleTodo(id1)
    useTodoStore.getState().toggleTodo(id2)
    const rate = useTodoStore.getState().getCompletionRate()
    expect(rate).toBe(100)
  })

  it('새 할 일은 리스트 맨 앞에 추가됨', () => {
    const { addTodo } = useTodoStore.getState()
    addTodo('첫 번째')
    addTodo('두 번째')

    const { todos } = useTodoStore.getState()
    expect(todos[0].title).toBe('두 번째')
    expect(todos[1].title).toBe('첫 번째')
  })
})
