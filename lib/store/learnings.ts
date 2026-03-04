import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChecklistItem {
  id: string;
  title: string;
  order: number; // 순서
  createdAt: string;
}

export interface DailyChecklist {
  id: string;
  learningId: string;
  date: string; // yyyy-MM-dd
  checkedItems: string[]; // 체크된 항목 ID 목록
  createdAt: string;
}

export interface Learning {
  id: string;
  title: string;
  createdAt: string; // ISO string
  startDate?: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
  progress: number; // 0..100 (자동 계산)
  joined: boolean;
  type: "study" | "project" | "course" | "other";
  checklist?: ChecklistItem[];
  progressMode: "manual" | "checklist" | "days";
}

interface LearningState {
  learnings: Learning[];
  dailyChecklists: DailyChecklist[];
  addLearning: (title: string, startDate?: string, endDate?: string, progressMode?: "checklist" | "manual" | "days") => string;
  removeLearning: (id: string) => void;
  toggleJoined: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  updateDates: (id: string, startDate?: string, endDate?: string) => void;
  updateLearning: (id: string, updates: Partial<Omit<Learning, "id" | "createdAt">>) => void;
  // 체크리스트 관리
  addChecklistItem: (learningId: string, title: string) => void;
  updateChecklistItem: (learningId: string, itemId: string, title: string) => void;
  removeChecklistItem: (learningId: string, itemId: string) => void;
  reorderChecklist: (learningId: string, items: ChecklistItem[]) => void;
  // 일간 체크리스트 관리
  getDailyChecklist: (learningId: string, date: string) => DailyChecklist | undefined;
  toggleDailyChecklistItem: (learningId: string, date: string, itemId: string) => void;
  getDailyProgress: (learningId: string, date: string) => number;
  // 진행률 자동 계산
  calculateProgress: (learningId: string) => number;
  calculateProgressFromDaily: (learningId: string) => number;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      learnings: [],
      dailyChecklists: [],
      addLearning: (title: string, startDate?: string, endDate?: string, progressMode?: "checklist" | "manual" | "days") => {
        const id = `l_${Math.random().toString(36).slice(2, 8)}`;
        const createdAt = new Date().toISOString();
        const learning: Learning = { 
          id, 
          title, 
          createdAt, 
          startDate, 
          endDate, 
          progress: 0, 
          joined: true,
          type: "project",
          progressMode: progressMode || "manual",
          checklist: []
        };
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
      updateDates: (id: string, startDate?: string, endDate?: string) => {
        set((s) => ({ learnings: s.learnings.map((l) => (l.id === id ? { ...l, startDate, endDate } : l)) }));
      },
      updateLearning: (id: string, updates: Partial<Omit<Learning, "id" | "createdAt">>) => {
        set((s) => ({ 
          learnings: s.learnings.map((l) => {
            if (l.id !== id) return l;
            
            const updated = { ...l, ...updates };
            
            // 체크리스트 모드일 때 체크리스트가 없으면 빈 배열로 설정
            if (updated.progressMode === "checklist" && !updated.checklist) {
              updated.checklist = [];
            }
            
            return updated;
          })
        }));
      },
      // 체크리스트 관리
      addChecklistItem: (learningId: string, title: string) => {
        const learning = get().learnings.find(l => l.id === learningId);
        if (!learning) return;
        
        const maxOrder = Math.max(...(learning.checklist || []).map(item => item.order), -1);
        const itemId = `c_${Math.random().toString(36).slice(2, 8)}`;
        const newItem: ChecklistItem = {
          id: itemId,
          title,
          order: maxOrder + 1,
          createdAt: new Date().toISOString(),
        };
        
        set((s) => ({
          learnings: s.learnings.map((l) =>
            l.id === learningId
              ? { 
                  ...l, 
                  checklist: [...(l.checklist || []), newItem] 
                }
              : l
          ),
        }));
      },
      updateChecklistItem: (learningId: string, itemId: string, title: string) => {
        set((s) => ({
          learnings: s.learnings.map((learning) =>
            learning.id === learningId
              ? {
                  ...learning,
                  checklist: (learning.checklist || []).map((item) =>
                    item.id === itemId ? { ...item, title } : item
                  ),
                }
              : learning
          ),
        }));
      },
      removeChecklistItem: (learningId: string, itemId: string) => {
        set((s) => ({
          learnings: s.learnings.map((learning) =>
            learning.id === learningId
              ? {
                  ...learning,
                  checklist: (learning.checklist || [])
                    .filter((item) => item.id !== itemId)
                    .map((item, index) => ({ ...item, order: index })),
                }
              : learning
          ),
        }));
      },
      reorderChecklist: (learningId: string, items: ChecklistItem[]) => {
        set((s) => ({
          learnings: s.learnings.map((learning) =>
            learning.id === learningId
              ? { ...learning, checklist: items.map((item, index) => ({ ...item, order: index })) }
              : learning
          ),
        }));
      },
      // 일간 체크리스트 관리
      getDailyChecklist: (learningId: string, date: string) => {
        return get().dailyChecklists.find(
          (dc) => dc.learningId === learningId && dc.date === date
        );
      },
      toggleDailyChecklistItem: (learningId: string, date: string, itemId: string) => {
        const existingDailyChecklist = get().getDailyChecklist(learningId, date);
        
        if (existingDailyChecklist) {
          // 기존 일간 체크리스트가 있으면 토글
          const isChecked = existingDailyChecklist.checkedItems.includes(itemId);
          const updatedCheckedItems = isChecked
            ? existingDailyChecklist.checkedItems.filter((id) => id !== itemId)
            : [...existingDailyChecklist.checkedItems, itemId];
          
          if (updatedCheckedItems.length === 0) {
            // 모든 항목이 체크 해제되면 일간 체크리스트 삭제
            set((s) => ({
              dailyChecklists: s.dailyChecklists.filter(
                (dc) => !(dc.learningId === learningId && dc.date === date)
              ),
            }));
          } else {
            // 업데이트
            set((s) => ({
              dailyChecklists: s.dailyChecklists.map((dc) =>
                dc.learningId === learningId && dc.date === date
                  ? { ...dc, checkedItems: updatedCheckedItems }
                  : dc
              ),
            }));
          }
        } else {
          // 새로운 일간 체크리스트 생성
          const newDailyChecklist: DailyChecklist = {
            id: `dc_${Math.random().toString(36).slice(2, 8)}`,
            learningId,
            date,
            checkedItems: [itemId],
            createdAt: new Date().toISOString(),
          };
          
          set((s) => ({
            dailyChecklists: [...s.dailyChecklists, newDailyChecklist],
          }));
        }
        
        // 체크리스트 모드일 경우 자동으로 진행률 업데이트
        const learning = get().learnings.find(l => l.id === learningId);
        if (learning && learning.progressMode === "checklist") {
          const newProgress = get().calculateProgressFromDaily(learningId);
          set((s) => ({
            learnings: s.learnings.map((l) =>
              l.id === learningId ? { ...l, progress: newProgress } : l
            ),
          }));
        }
      },
      getDailyProgress: (learningId: string, date: string) => {
        const learning = get().learnings.find((l) => l.id === learningId);
        const dailyChecklist = get().getDailyChecklist(learningId, date);
        
        if (!learning || !learning.checklist || learning.checklist.length === 0) return 0;
        if (!dailyChecklist) return 0;
        
        return Math.round((dailyChecklist.checkedItems.length / learning.checklist.length) * 100);
      },
      // 진행률 자동 계산
      calculateProgress: (learningId: string) => {
        const learning = get().learnings.find(l => l.id === learningId);
        if (!learning) return 0;
        
        switch (learning.progressMode) {
          case "checklist":
            // 일간 체크리스트 기반으로 계산
            return get().calculateProgressFromDaily(learningId);
          
          case "days":
            if (!learning.startDate || !learning.endDate) return 0;
            const start = new Date(learning.startDate);
            const end = new Date(learning.endDate);
            const today = new Date();
            
            const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            
            return Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));
          
          case "manual":
          default:
            return learning.progress;
        }
      },
      calculateProgressFromDaily: (learningId: string) => {
        const learning = get().learnings.find(l => l.id === learningId);
        if (!learning || !learning.checklist || learning.checklist.length === 0) return 0;
        
        const { dailyChecklists } = get();
        
        // 시작일과 종료일 설정
        const startDate = learning.startDate ? new Date(learning.startDate) : new Date(learning.createdAt);
        const endDate = learning.endDate ? new Date(learning.endDate) : new Date();
        const today = new Date();
        
                
        // 경과일수 계산 (시작일부터 오늘까지)
        let elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        // 오늘이 시작일보다 이전이면 경과일수를 1로 설정
        if (today < startDate) {
          elapsedDays = 1;
        }
        
        // 오늘 체크리스트 확인
        const todayStr = today.toISOString().split('T')[0];
        const todayChecklist = dailyChecklists.find(
          dc => dc.learningId === learningId && dc.date === todayStr
        );
        
        // 전체 기간 계산
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        // 각 날짜별 체크된 항목 수 계산 (부분 체크도 반영, 미래 날짜 포함)
        let totalCheckedItems = 0;
        
        for (let i = 0; i < totalDays; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(currentDate.getDate() + i);
          const dateStr = currentDate.toISOString().split('T')[0];
          
          // 해당 날짜의 체크리스트 확인
          const dayChecklist = dailyChecklists.find(
            dc => dc.learningId === learningId && dc.date === dateStr
          );
          
          const dailyChecks = dayChecklist ? dayChecklist.checkedItems.length : 0;
          totalCheckedItems += dailyChecks;
        }
        
        // 진행률 = (총 체크된 항목 수) / (전체 기간일수 × 체크리스트 항목 수) × 100
        const maxPossibleChecks = totalDays * learning.checklist.length;
        const progress = maxPossibleChecks > 0 ? (totalCheckedItems / maxPossibleChecks) * 100 : 0;
        const roundedProgress = Math.round(progress * 100) / 100;
        
        return Math.min(100, Math.max(0, roundedProgress));
      },
    }),
    {
      name: "learnings-storage",
    }
  )
);
