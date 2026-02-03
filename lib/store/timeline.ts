import { create, type StateCreator } from "zustand";
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

// 시작할 때 가지고 있을 예시(샘플) 일정들이에요.
const seed: TimelineItem[] = [
  { id: "w1", date: "2026-01-26", start: "19:30", end: "21:00", title: "알고리즘 스터디", type: "study" },
  { id: "w2", date: "2026-01-27", start: "20:00", end: "22:00", title: "토익 LC", type: "language" },
  { id: "w3", date: "2026-01-29", start: "19:00", end: "20:30", title: "CS정리", type: "solo" },
  { id: "w4", date: "2026-01-31", start: "10:00", end: "12:00", title: "프로젝트 작업", type: "project" },
];

const creator: StateCreator<TimelineState> = (set, get) => ({
  items: seed,
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

export const useTimelineStore = create<TimelineState>(creator);

export { dateToKey };
