import { create } from "zustand";

export interface Learning {
  id: string;
  title: string;
  createdAt: string; // ISO string
  progress: number; // 0..100
  joined: boolean;
}

interface LearningState {
  learnings: Learning[];
  addLearning: (title: string) => string;
  removeLearning: (id: string) => void;
  toggleJoined: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
}

export const useLearningStore = create<LearningState>((set, get) => ({
  learnings: [],
  addLearning: (title: string) => {
    const id = `l_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();
    const learning: Learning = { id, title, createdAt, progress: 0, joined: true };
    set((s) => ({ learnings: [learning, ...s.learnings] }));
    return id;
  },
  removeLearning: (id: string) => {
    set((s) => ({ learnings: s.learnings.filter((l) => l.id !== id) }));
  },
  toggleJoined: (id: string) => {
    set((s) => ({ learnings: s.learnings.map((l) => (l.id === id ? { ...l, joined: !l.joined } : l)) }));
  },
  updateProgress: (id: string, progress: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(progress)));
    set((s) => ({ learnings: s.learnings.map((l) => (l.id === id ? { ...l, progress: clamped } : l)) }));
  },
}));
