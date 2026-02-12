import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReflectionCategory = "study" | "personal" | "project" | "health" | "other";

export interface ReflectionEntry {
  id: string;
  date: string; // yyyy-MM-dd
  content: string; // 회고 내용 (마크다운)
  category: ReflectionCategory; // 카테고리
  mood?: "great" | "good" | "okay" | "bad"; // 기분
  tags?: string[]; // 태그
  createdAt: string;
  updatedAt: string;
}

interface ReflectionStore {
  reflections: ReflectionEntry[];
  
  // CRUD
  addReflection: (data: Omit<ReflectionEntry, "id" | "createdAt" | "updatedAt">) => void;
  updateReflection: (id: string, data: Partial<Omit<ReflectionEntry, "id" | "createdAt">>) => void;
  deleteReflection: (id: string) => void;
  
  // 조회
  getReflectionByDate: (date: string) => ReflectionEntry | undefined;
  getReflectionsByMonth: (year: number, month: number) => ReflectionEntry[];
  getReflectionsByCategory: (category: ReflectionCategory) => ReflectionEntry[];
  getAllReflections: () => ReflectionEntry[];
}

export const useReflectionStore = create<ReflectionStore>()(
  persist(
    (set, get) => ({
      reflections: [],
      
      addReflection: (data) => {
        const now = new Date().toISOString();
        const newReflection: ReflectionEntry = {
          ...data,
          id: `reflection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
        };
        
        set((state) => ({
          reflections: [...state.reflections, newReflection],
        }));
      },
      
      updateReflection: (id, data) => {
        set((state) => ({
          reflections: state.reflections.map((reflection) =>
            reflection.id === id
              ? { ...reflection, ...data, updatedAt: new Date().toISOString() }
              : reflection
          ),
        }));
      },
      
      deleteReflection: (id) => {
        set((state) => ({
          reflections: state.reflections.filter((reflection) => reflection.id !== id),
        }));
      },
      
      getReflectionByDate: (date) => {
        return get().reflections.find((reflection) => reflection.date === date);
      },
      
      getReflectionsByMonth: (year, month) => {
        return get().reflections.filter((reflection) => {
          const reflectionDate = new Date(reflection.date);
          return (
            reflectionDate.getFullYear() === year &&
            reflectionDate.getMonth() + 1 === month
          );
        });
      },
      
      getReflectionsByCategory: (category) => {
        return get().reflections
          .filter((reflection) => reflection.category === category)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      
      getAllReflections: () => {
        return get().reflections.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },
    }),
    {
      name: "reflection-storage",
    }
  )
);
