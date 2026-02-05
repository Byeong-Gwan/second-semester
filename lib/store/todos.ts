import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO string
  dueDate?: string; // yyyy-MM-dd
  priority: "low" | "medium" | "high";
}

interface TodoState {
  todos: Todo[];
  addTodo: (title: string, dueDate?: string, priority?: "low" | "medium" | "high") => string;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, updates: Partial<Omit<Todo, "id" | "createdAt">>) => void;
  getCompletionRate: () => number;
  getTodayTodos: () => Todo[];
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (title: string, dueDate?: string, priority: "low" | "medium" | "high" = "medium") => {
        const id = `todo_${Math.random().toString(36).slice(2, 8)}`;
        const createdAt = new Date().toISOString();
        const todo: Todo = { id, title, completed: false, createdAt, dueDate, priority };
        set((s) => ({ todos: [todo, ...s.todos] }));
        return id;
      },
      removeTodo: (id: string) => {
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
      },
      toggleTodo: (id: string) => {
        set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) }));
      },
      updateTodo: (id: string, updates: Partial<Omit<Todo, "id" | "createdAt">>) => {
        set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, ...updates } : t)) }));
      },
      getCompletionRate: () => {
        const todos = get().todos;
        if (todos.length === 0) return 0;
        const completed = todos.filter((t) => t.completed).length;
        return Math.round((completed / todos.length) * 100);
      },
      getTodayTodos: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().todos.filter((t) => t.dueDate === today);
      },
    }),
    {
      name: "todos-storage",
    }
  )
);
