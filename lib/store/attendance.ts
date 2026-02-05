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
        if (records.length === 0) return 100;
        const present = records.filter((r) => r.status === "present").length;
        return Math.round((present / records.length) * 100);
      },
      getMonthRecords: (year: number, month: number) => {
        const prefix = `${year}-${String(month).padStart(2, "0")}`;
        return get().records.filter((r) => r.date.startsWith(prefix));
      },
    }),
    {
      name: "attendance-storage",
    }
  )
);
