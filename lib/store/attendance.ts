import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";

export interface AttendanceRecord {
  date: string; // yyyy-MM-dd
  status: "present" | "absent" | "late";
}

interface AttendanceState {
  records: AttendanceRecord[];
  allowedAbsences: number;
  markAttendance: (date: string, status: "present" | "absent" | "late") => void;
  removeAttendance: (date: string) => void;
  getUsedAbsences: () => number;
  getRemainingAbsences: () => number;
  getAttendanceRate: () => number;
  getMonthRecords: (year: number, month: number) => AttendanceRecord[];
  getWeekRecords: (startDate: Date) => AttendanceRecord[];
  getStreak: () => number;
  getMonthStats: (year: number, month: number) => {
    total: number;
    present: number;
    late: number;
    absent: number;
    rate: number;
  };
  getWeekStats: (startDate: Date) => {
    total: number;
    present: number;
    late: number;
    absent: number;
    rate: number;
  };
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      allowedAbsences: 5,
      markAttendance: (date: string, status: "present" | "absent" | "late") => {
        set((s) => {
          const existing = s.records.find((r) => r.date === date);
          if (existing) {
            return { records: s.records.map((r) => (r.date === date ? { ...r, status } : r)) };
          }
          return { records: [...s.records, { date, status }] };
        });
      },
      removeAttendance: (date: string) => {
        set((s) => ({ records: s.records.filter((r) => r.date !== date) }));
      },
      getUsedAbsences: () => {
        return get().records.filter((r) => r.status === "absent").length;
      },
      getRemainingAbsences: () => {
        const used = get().getUsedAbsences();
        return Math.max(0, get().allowedAbsences - used);
      },
      getAttendanceRate: () => {
        const records = get().records;
        if (records.length === 0) return 0;
        
        // 출석: 1점, 지각: 0.5점, 결석: 0점
        const totalScore = records.reduce((sum, record) => {
          if (record.status === "present") return sum + 1;
          if (record.status === "late") return sum + 0.5;
          return sum; // absent = 0
        }, 0);
        
        return Math.round((totalScore / records.length) * 100);
      },
      getMonthRecords: (year: number, month: number) => {
        const prefix = `${year}-${String(month).padStart(2, "0")}`;
        return get().records.filter((r) => r.date.startsWith(prefix));
      },
      getWeekRecords: (startDate: Date) => {
        const records = get().records;
        const start = format(startDate, "yyyy-MM-dd");
        const end = format(new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");
        return records.filter((r) => r.date >= start && r.date <= end);
      },
      getStreak: () => {
        const records = get().records;
        if (records.length === 0) return 0;
        
        const sortedRecords = [...records]
          .filter(r => r.status === "present" || r.status === "late")
          .sort((a, b) => b.date.localeCompare(a.date));
        
        if (sortedRecords.length === 0) return 0;
        
        let streak = 0;
        const today = format(new Date(), "yyyy-MM-dd");
        let currentDate = today;
        
        for (const record of sortedRecords) {
          if (record.date === currentDate) {
            streak++;
            const date = new Date(record.date);
            date.setDate(date.getDate() - 1);
            currentDate = format(date, "yyyy-MM-dd");
          } else if (record.date < currentDate) {
            const daysDiff = Math.floor((new Date(currentDate).getTime() - new Date(record.date).getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
              streak++;
              const date = new Date(record.date);
              date.setDate(date.getDate() - 1);
              currentDate = format(date, "yyyy-MM-dd");
            } else {
              break;
            }
          }
        }
        
        return streak;
      },
      getMonthStats: (year: number, month: number) => {
        const records = get().getMonthRecords(year, month);
        const total = records.length;
        const present = records.filter((r) => r.status === "present").length;
        const late = records.filter((r) => r.status === "late").length;
        const absent = records.filter((r) => r.status === "absent").length;
        const rate = total === 0 ? 100 : Math.round((present / total) * 100);
        return { total, present, late, absent, rate };
      },
      getWeekStats: (startDate: Date) => {
        const records = get().getWeekRecords(startDate);
        const total = records.length;
        const present = records.filter((r) => r.status === "present").length;
        const late = records.filter((r) => r.status === "late").length;
        const absent = records.filter((r) => r.status === "absent").length;
        const rate = total === 0 ? 100 : Math.round((present / total) * 100);
        return { total, present, late, absent, rate };
      },
    }),
    {
      name: "attendance-storage",
    }
  )
);
