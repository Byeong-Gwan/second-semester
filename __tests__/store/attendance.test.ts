import { describe, it, expect, beforeEach } from 'vitest'
import { useAttendanceStore } from '@/lib/store/attendance'

describe('Attendance Store', () => {
  beforeEach(() => {
    useAttendanceStore.setState({ records: [], allowedAbsences: 5 })
  })

  it('초기 상태: 빈 배열', () => {
    const { records } = useAttendanceStore.getState()
    expect(records).toEqual([])
  })

  it('출석 기록 추가', () => {
    useAttendanceStore.getState().markAttendance('2026-02-25', 'present')
    const { records } = useAttendanceStore.getState()
    expect(records).toHaveLength(1)
    expect(records[0]).toEqual({ date: '2026-02-25', status: 'present' })
  })

  it('같은 날짜 출석 상태 업데이트', () => {
    useAttendanceStore.getState().markAttendance('2026-02-25', 'present')
    useAttendanceStore.getState().markAttendance('2026-02-25', 'late')

    const { records } = useAttendanceStore.getState()
    expect(records).toHaveLength(1)
    expect(records[0].status).toBe('late')
  })

  it('출석 기록 삭제', () => {
    useAttendanceStore.getState().markAttendance('2026-02-25', 'present')
    useAttendanceStore.getState().removeAttendance('2026-02-25')

    const { records } = useAttendanceStore.getState()
    expect(records).toHaveLength(0)
  })

  it('결석 횟수 계산', () => {
    const { markAttendance } = useAttendanceStore.getState()
    markAttendance('2026-02-20', 'present')
    markAttendance('2026-02-21', 'absent')
    markAttendance('2026-02-22', 'absent')
    markAttendance('2026-02-23', 'present')

    expect(useAttendanceStore.getState().getUsedAbsences()).toBe(2)
  })

  it('잔여 결석 횟수 계산', () => {
    const { markAttendance } = useAttendanceStore.getState()
    markAttendance('2026-02-20', 'absent')
    markAttendance('2026-02-21', 'absent')

    expect(useAttendanceStore.getState().getRemainingAbsences()).toBe(3)
  })

  it('출석률 계산: 빈 배열이면 0', () => {
    expect(useAttendanceStore.getState().getAttendanceRate()).toBe(0)
  })

  it('출석률 계산: 출석 1점, 지각 0.5점, 결석 0점', () => {
    const { markAttendance } = useAttendanceStore.getState()
    markAttendance('2026-02-20', 'present')  // 1
    markAttendance('2026-02-21', 'late')     // 0.5
    markAttendance('2026-02-22', 'absent')   // 0
    markAttendance('2026-02-23', 'present')  // 1

    // (1 + 0.5 + 0 + 1) / 4 = 0.625 → 63%
    expect(useAttendanceStore.getState().getAttendanceRate()).toBe(63)
  })

  it('월별 기록 조회', () => {
    const { markAttendance } = useAttendanceStore.getState()
    markAttendance('2026-01-15', 'present')
    markAttendance('2026-02-10', 'present')
    markAttendance('2026-02-25', 'late')

    const febRecords = useAttendanceStore.getState().getMonthRecords(2026, 2)
    expect(febRecords).toHaveLength(2)
  })

  it('월별 통계 계산', () => {
    const { markAttendance } = useAttendanceStore.getState()
    markAttendance('2026-02-10', 'present')
    markAttendance('2026-02-11', 'late')
    markAttendance('2026-02-12', 'absent')

    const stats = useAttendanceStore.getState().getMonthStats(2026, 2)
    expect(stats.total).toBe(3)
    expect(stats.present).toBe(1)
    expect(stats.late).toBe(1)
    expect(stats.absent).toBe(1)
  })
})
