"use client";

import React from "react";
import { useTodoStore, type Todo } from "@/lib/store/todos";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, X, CheckCircle2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useGlobalPopupState } from "@/lib/hooks/usePopupState";

const priorityConfig = {
  high: { label: "높음", color: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-500", prefix: "🔥 " },
  medium: { label: "보통", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400 border-yellow-500", prefix: "" },
  low: { label: "낮음", color: "bg-gray-100 text-gray-700 dark:bg-gray-950/50 dark:text-gray-400 border-gray-400", prefix: "" },
};

export default function TodosTab() {
  const { todos, removeTodo, toggleTodo, getCompletionRate } = useTodoStore();
  const [showModal, setShowModal] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Todo | null>(null);
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">("all");
  const [mounted, setMounted] = React.useState(false);
  const { openPopup, closePopup } = useGlobalPopupState();

  React.useEffect(() => { setMounted(true); }, []);
  
  React.useEffect(() => {
    if (showModal) {
      openPopup('drawer');
    } else {
      closePopup();
    }
  }, [showModal]);
  
  if (!mounted) return <div className="animate-pulse h-40 bg-muted rounded-xl" />;

  const completionRate = getCompletionRate();
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  const filteredTodos = todos
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const handleEdit = (todo: Todo) => {
    setEditTarget(todo);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("이 할 일을 삭제하시겠습니까?")) {
      removeTodo(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* 완료율 요약 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">완료율</span>
            <span className="text-lg font-bold">{completionRate}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                completionRate >= 80 ? "bg-green-500" : completionRate >= 50 ? "bg-yellow-500" : "bg-gray-400"
              }`}
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{stats.completed}개 완료</span>
            <span>{stats.active}개 남음</span>
          </div>
        </CardContent>
      </Card>

      {/* 필터 */}
      <div className="flex gap-2">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {f === "all" ? `전체 (${stats.total})` : f === "active" ? `진행중 (${stats.active})` : `완료 (${stats.completed})`}
          </button>
        ))}
      </div>

      {/* 추가 버튼 */}
      <button
        onClick={() => { setEditTarget(null); setShowModal(true); }}
        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-primary font-medium hover:bg-primary/10 transition-colors min-h-[52px] active:scale-[0.98]"
      >
        <Plus className="h-5 w-5" />
        할 일 추가
      </button>

      {/* 할 일 목록 */}
      {filteredTodos.length === 0 ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">할 일이 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <Card key={todo.id} className={`overflow-hidden transition-all ${
              todo.completed ? "opacity-60" : ""
            }`}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  {/* 체크 버튼 */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-90 transition-transform"
                    aria-label="완료 토글"
                  >
                    <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? "bg-green-500 border-green-500 shadow-sm"
                        : todo.priority === "high" ? "border-red-400" : todo.priority === "medium" ? "border-yellow-400" : "border-gray-300"
                    }`}>
                      {todo.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                  </button>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <span className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                      {todo.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${priorityConfig[todo.priority].color}`}>
                        {priorityConfig[todo.priority].prefix}{priorityConfig[todo.priority].label}
                      </Badge>
                      {todo.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(todo.dueDate), "M/d (EEE)", { locale: ko })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-2.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="수정"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 모달 */}
      {showModal && (
        <TodoModal
          todo={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
        />
      )}
    </div>
  );
}

function TodoModal({ todo, onClose }: { todo: Todo | null; onClose: () => void }) {
  const { addTodo, updateTodo } = useTodoStore();
  const [formData, setFormData] = React.useState({
    title: todo?.title || "",
    dueDate: todo?.dueDate || "",
    priority: todo?.priority || ("medium" as "low" | "medium" | "high"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    if (todo) {
      updateTodo(todo.id, formData);
    } else {
      addTodo(formData.title, formData.dueDate || undefined, formData.priority);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{todo ? "할 일 수정" : "할 일 추가"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
              placeholder="할 일 제목"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium">마감일</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
            />
          </div>

          <div>
            <label className="text-sm font-medium">우선순위</label>
            <div className="flex gap-2 mt-1.5">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`flex-1 rounded-xl border-2 py-3 text-sm font-medium transition-all min-h-[48px] ${
                    formData.priority === p
                      ? p === "high" ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        : p === "medium" ? "border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                        : "border-gray-400 bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400"
                      : "border-muted hover:bg-muted/50"
                  }`}
                >
                  {p === "high" ? "🔥 높음" : p === "medium" ? "보통" : "낮음"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all min-h-[52px]"
            >
              {todo ? "저장" : "추가"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 px-4 py-3.5 text-base font-semibold hover:bg-accent active:scale-[0.98] transition-all min-h-[52px]"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
