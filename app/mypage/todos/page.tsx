"use client";

import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoStore, type Todo } from "@/lib/store/todos";
import { Plus, Trash2, Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

const priorityColors = {
  low: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
  medium: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  high: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const priorityLabels = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

export default function TodosPage() {
  const { todos, removeTodo, toggleTodo, getCompletionRate } = useTodoStore();
  const [showModal, setShowModal] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string>("");
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"createdAt" | "dueDate" | "priority">("createdAt");
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [mounted, setMounted] = React.useState(false);
  const [showYearPicker, setShowYearPicker] = React.useState(false);
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const completionRate = mounted ? getCompletionRate() : 0;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setShowYearPicker(false);
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(month - 1);
    setCurrentMonth(newDate);
    setShowMonthPicker(false);
  };

  const getTodosForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return todos.filter((t) => t.dueDate === dateStr);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(format(date, "yyyy-MM-dd"));
    setShowModal(true);
  };

  const filteredTodos = React.useMemo(() => {
    let result = todos;

    if (filter === "active") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);

    if (searchQuery) {
      result = result.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return result.sort((a, b) => {
      if (sortBy === "createdAt") return b.createdAt.localeCompare(a.createdAt);
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
  }, [todos, filter, searchQuery, sortBy]);

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <CardDetailLayout
      title="할 일"
      description="할 일을 관리하고 완료율을 확인합니다."
      actions={
        <button
          onClick={() => {
            setSelectedDate("");
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          할 일 추가
        </button>
      }
    >
      {showModal && <TodoModal onClose={() => setShowModal(false)} preselectedDate={selectedDate} />}

      {/* 달력 뷰 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">달력</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="rounded-md border p-2 hover:bg-accent">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleToday} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
              오늘
            </button>
            <button onClick={handleNextMonth} className="rounded-md border p-2 hover:bg-accent">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* 년도/월 선택 */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* 년도 선택 */}
              <div className="relative">
                <button
                  onClick={() => setShowYearPicker(!showYearPicker)}
                  className="text-lg font-bold hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
                >
                  {format(currentMonth, "yyyy년", { locale: ko })}
                </button>
                {showYearPicker && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowYearPicker(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 bg-background border-2 rounded-xl shadow-xl py-2 z-20 min-w-[120px] max-h-[300px] overflow-y-auto">
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                        <button
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          className={`w-full px-6 py-3 text-left text-base font-medium transition-colors ${
                            year === currentMonth.getFullYear()
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          }`}
                        >
                          {year}년
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 월 선택 */}
              <div className="relative">
                <button
                  onClick={() => setShowMonthPicker(!showMonthPicker)}
                  className="text-lg font-bold hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-accent"
                >
                  {format(currentMonth, "M월", { locale: ko })}
                </button>
                {showMonthPicker && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMonthPicker(false)}
                    />
                    <div className="absolute top-full mt-2 right-0 bg-background border-2 rounded-xl shadow-xl py-2 z-20 min-w-[120px] max-h-[400px] overflow-y-auto">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <button
                          key={month}
                          onClick={() => handleMonthSelect(month)}
                          className={`w-full px-6 py-3 text-left text-base font-medium transition-colors ${
                            month === currentMonth.getMonth() + 1
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          }`}
                        >
                          {month}월
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground pb-2">
                  {day}
                </div>
              ))}

              {emptyDays.map((i) => (
                <div key={`empty-${i}`} />
              ))}

              {daysInMonth.map((date) => {
                const dateTodos = getTodosForDate(date);
                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={date.toISOString()}
                    className={`group relative min-h-[80px] rounded-md border p-2 hover:bg-accent/50 transition-colors ${
                      isToday ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{format(date, "d")}</div>
                    
                    {/* 할 일 개수 표시 */}
                    {dateTodos.length > 0 && (
                      <div className="text-xs text-muted-foreground mb-1">
                        {dateTodos.filter((t) => !t.completed).length}/{dateTodos.length}
                      </div>
                    )}

                    {/* hover 시 + 버튼 */}
                    <button
                      onClick={() => handleDateClick(date)}
                      className="absolute inset-0 flex items-center justify-center bg-primary/90 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                    >
                      <Plus size={24} />
                    </button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">컨트롤</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  filter === "all" ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
                }`}
              >
                전체 ({stats.total})
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  filter === "active" ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
                }`}
              >
                진행중 ({stats.active})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  filter === "completed" ? "bg-primary text-primary-foreground" : "border hover:bg-accent"
                }`}
              >
                완료 ({stats.completed})
              </button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="할 일 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border pl-9 pr-3 py-2 text-sm"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value="createdAt">생성일순</option>
                <option value="dueDate">마감일순</option>
                <option value="priority">우선순위순</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">완료율</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted opacity-20" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionRate / 100)}`}
                    className="text-primary transition-all duration-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{completionRate}%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {stats.completed}개 완료 / {stats.total}개 전체
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">목록</h2>
        <Card>
          <CardContent className="pt-6">
            {filteredTodos.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                {searchQuery ? "검색 결과가 없습니다." : "할 일이 없습니다. 할 일을 추가해보세요!"}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} onRemove={removeTodo} onToggle={toggleTodo} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CardDetailLayout>
  );
}

function TodoItem({
  todo,
  onRemove,
  onToggle,
}: {
  todo: Todo;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent/50">
      <Checkbox 
        checked={todo.completed} 
        onCheckedChange={(checked) => {
          onToggle(todo.id);
        }} 
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${todo.completed ? "line-through opacity-60" : ""}`}>{todo.title}</span>
          <Badge variant="outline" className={`text-xs ${priorityColors[todo.priority]}`}>
            {priorityLabels[todo.priority]}
          </Badge>
        </div>
        {todo.dueDate && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} />
            {format(new Date(todo.dueDate), "yyyy년 M월 d일 (EEE)", { locale: ko })}
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(todo.id)}
        className="shrink-0 rounded-md p-2 hover:bg-destructive/20 text-destructive"
        aria-label="삭제"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function TodoModal({ onClose, preselectedDate }: { onClose: () => void; preselectedDate?: string }) {
  const { addTodo } = useTodoStore();
  const [formData, setFormData] = React.useState({
    title: "",
    dueDate: preselectedDate || "",
    priority: "medium" as "low" | "medium" | "high",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addTodo(formData.title, formData.dueDate || undefined, formData.priority);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold">할 일 추가</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="할 일 제목"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">마감일 (선택)</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">우선순위</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="low">낮음</option>
              <option value="medium">보통</option>
              <option value="high">높음</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              추가
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
