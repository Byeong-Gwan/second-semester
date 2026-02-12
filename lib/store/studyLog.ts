import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";

export interface StudyLogEntry {
  id: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  subject: string; // 과목/주제
  description?: string; // 메모
  duration: number; // 분 단위
}

interface StudyLogState {
  logs: StudyLogEntry[];
  addLog: (log: Omit<StudyLogEntry, "id" | "duration">) => void;
  updateLog: (id: string, log: Partial<Omit<StudyLogEntry, "id">>) => void;
  deleteLog: (id: string) => void;
  getLogsByDate: (date: string) => StudyLogEntry[];
  getTotalDurationByDate: (date: string) => number;
  getSubjectDurationByDate: (date: string) => Record<string, number>;
  getWeeklyStats: (startDate: Date) => {
    totalMinutes: number;
    dailyMinutes: Record<string, number>;
    subjectMinutes: Record<string, number>;
  };
}

// 시간 문자열을 분으로 변환
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// 시작/종료 시간으로 duration 계산
function calculateDuration(startTime: string, endTime: string): number {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  // 자정을 넘어가는 경우 처리
  if (endMinutes < startMinutes) {
    return 24 * 60 - startMinutes + endMinutes;
  }
  
  return endMinutes - startMinutes;
}

export const useStudyLogStore = create<StudyLogState>()(
  persist(
    (set, get) => ({
      logs: [],
      
      addLog: (log) => {
        const duration = calculateDuration(log.startTime, log.endTime);
        const newLog: StudyLogEntry = {
          ...log,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          duration,
        };
        
        set((state) => ({
          logs: [...state.logs, newLog].sort((a, b) => {
            // 날짜 + 시간 순으로 정렬
            if (a.date !== b.date) {
              return a.date.localeCompare(b.date);
            }
            return a.startTime.localeCompare(b.startTime);
          }),
        }));
      },
      
      updateLog: (id, updates) => {
        set((state) => ({
          logs: state.logs.map((log) => {
            if (log.id !== id) return log;
            
            const updated = { ...log, ...updates };
            
            // 시간이 변경되면 duration 재계산
            if (updates.startTime || updates.endTime) {
              updated.duration = calculateDuration(updated.startTime, updated.endTime);
            }
            
            return updated;
          }),
        }));
      },
      
      deleteLog: (id) => {
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        }));
      },
      
      getLogsByDate: (date) => {
        return get().logs.filter((log) => log.date === date);
      },
      
      getTotalDurationByDate: (date) => {
        const logs = get().getLogsByDate(date);
        return logs.reduce((total, log) => total + log.duration, 0);
      },
      
      getSubjectDurationByDate: (date) => {
        const logs = get().getLogsByDate(date);
        const subjectDurations: Record<string, number> = {};
        
        logs.forEach((log) => {
          if (!subjectDurations[log.subject]) {
            subjectDurations[log.subject] = 0;
          }
          subjectDurations[log.subject] += log.duration;
        });
        
        return subjectDurations;
      },
      
      getWeeklyStats: (startDate) => {
        const stats = {
          totalMinutes: 0,
          dailyMinutes: {} as Record<string, number>,
          subjectMinutes: {} as Record<string, number>,
        };
        
        // 7일간의 데이터 수집
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const dateStr = format(date, "yyyy-MM-dd");
          
          const logs = get().getLogsByDate(dateStr);
          const dailyTotal = logs.reduce((sum, log) => sum + log.duration, 0);
          
          stats.dailyMinutes[dateStr] = dailyTotal;
          stats.totalMinutes += dailyTotal;
          
          // 과목별 집계
          logs.forEach((log) => {
            if (!stats.subjectMinutes[log.subject]) {
              stats.subjectMinutes[log.subject] = 0;
            }
            stats.subjectMinutes[log.subject] += log.duration;
          });
        }
        
        return stats;
      },
    }),
    {
      name: "study-log-storage",
    }
  )
);
