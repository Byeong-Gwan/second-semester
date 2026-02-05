import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";

// 이 파일은 '시간표 공책'이에요. 하루에 무엇을 하는지 줄줄이 적어두고 꺼내 봅니다.

export type TimelineType = "study" | "language" | "solo" | "project" | "etc";

export interface TimelineItem {
  id: string;
  // 날짜는 "yyyy-MM-dd" 글자로 저장해요. (예: 2026-01-28)
  date: string;
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
  title: string;
  type: TimelineType;
  done?: boolean;
}

export interface TimelineState {
  items: TimelineItem[];
  add: (item: Omit<TimelineItem, "id">) => string;
  update: (id: string, patch: Partial<Omit<TimelineItem, "id">>) => void;
  toggleDone: (id: string) => void;
  remove: (id: string) => void;
  // 아주 쉬운 말: 어떤 날의 일정만 골라서 보여줘요.
  getByDate: (date: Date) => TimelineItem[];
}

function dateToKey(d: Date) {
  return format(d, "yyyy-MM-dd");
}

const creator: StateCreator<TimelineState> = (set, get) => ({
  items: [],
  add: (item: Omit<TimelineItem, "id">) => {
    const id = `t_${Math.random().toString(36).slice(2, 8)}`;
    set((s: TimelineState) => ({ items: [...s.items, { id, ...item }] }));
    return id;
  },
  update: (id: string, patch: Partial<Omit<TimelineItem, "id">>) => {
    set((s: TimelineState) => ({ items: s.items.map((it: TimelineItem) => (it.id === id ? { ...it, ...patch } : it)) }));
  },
  toggleDone: (id: string) => {
    set((s: TimelineState) => ({ items: s.items.map((it: TimelineItem) => (it.id === id ? { ...it, done: !it.done } : it)) }));
  },
  remove: (id: string) => {
    set((s: TimelineState) => ({ items: s.items.filter((it: TimelineItem) => it.id !== id) }));
  },
  getByDate: (date: Date) => {
    const key = dateToKey(date);
    return get().items.filter((it: TimelineItem) => it.date === key);
  },
});

export const useTimelineStore = create<TimelineState>()(
  persist(creator, {
    name: "timeline-storage",
  })
);

export { dateToKey };
