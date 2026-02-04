"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoStore, type Todo } from "@/lib/store/todos";
import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import React from "react";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns";
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

export default function TimelinePage() {
  const { todos, toggleTodo } = useTodoStore();
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const [showModal, setShowModal] = React.useState(false);
  const [showMonthPicker, setShowMonthPicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // 월요일 시작
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePrevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const handleToday = () => setCurrentWeek(new Date());

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentWeek);
    newDate.setMonth(month - 1);
    setCurrentWeek(newDate);
    setShowMonthPicker(false);
  };

  const handleDateSelect = (date: Date) => {
    setCurrentWeek(date);
    setShowDatePicker(false);
  };

  const getTodosForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return todos.filter((t) => t.dueDate === dateStr);
  };

  const handleAddClick = (date: Date) => {
    setSelectedDate(format(date, "yyyy-MM-dd"));
    setShowModal(true);
  };

  return (
    <main className="container max-w-7xl space-y-6 py-8">
      {showModal && <TodoModal onClose={() => setShowModal(false)} preselectedDate={selectedDate} />}

      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">주간 스케줄</h1>
          <p className="text-muted-foreground mt-1">이번 주 할 일을 한눈에 확인하세요</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          {/* 월 선택 */}
          <div className="relative">
            <button
              onClick={() => setShowMonthPicker(!showMonthPicker)}
              className="text-3xl font-bold hover:text-primary transition-colors px-4 py-2 rounded-lg border-2 border-transparent hover:border-primary"
            >
              {format(weekStart, "M월", { locale: ko })}
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
                        month === weekStart.getMonth() + 1
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
          {/* 일자 네비게이션 */}
          <div className="flex items-center gap-3">
            <button onClick={handlePrevWeek} className="rounded-full p-2 hover:bg-accent transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="text-sm font-medium whitespace-nowrap min-w-[100px] text-center px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                {format(weekStart, "d일", { locale: ko })} ~ {format(addDays(weekStart, 6), "d일", { locale: ko })}
              </button>
              {showDatePicker && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDatePicker(false)}
                  />
                  <div className="absolute top-full mt-2 right-0 bg-background border-2 rounded-xl shadow-xl py-2 z-20 min-w-[180px]">
                    {weekDays.map((date) => {
                      const dateTodos = getTodosForDate(date);
                      const isToday = isSameDay(date, new Date());
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => handleDateSelect(date)}
                          className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                            isToday
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          }`}
                        >
                          <div>
                            <div className="font-medium">
                              {format(date, "M월 d일 (EEE)", { locale: ko })}
                            </div>
                            {dateTodos.length > 0 && (
                              <div className="text-xs opacity-70 mt-0.5">
                                할 일 {dateTodos.length}개
                              </div>
                            )}
                          </div>
                          {isToday && (
                            <div className="text-xs font-bold">오늘</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <button onClick={handleNextWeek} className="rounded-full p-2 hover:bg-accent transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 주간 리스트 (세로) */}
      <div className="space-y-3">
        {weekDays.map((date) => {
          const dateTodos = getTodosForDate(date);
          const isToday = isSameDay(date, new Date());

          return (
            <Card key={date.toISOString()} className={isToday ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* 날짜 헤더 (왼쪽) */}
                  <div className="flex flex-col items-center justify-center min-w-[80px] pt-1">
                    <div className="text-xs text-muted-foreground">{format(date, "EEE", { locale: ko })}</div>
                    <div className="text-2xl font-bold">{format(date, "d")}</div>
                    <div className="text-xs text-muted-foreground">{format(date, "M월", { locale: ko })}</div>
                    {dateTodos.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {dateTodos.filter((t) => t.completed).length}/{dateTodos.length}
                      </div>
                    )}
                  </div>

                  {/* 할 일 목록 (오른쪽) */}
                  <div className="flex-1 space-y-2">
                    {dateTodos.length === 0 ? (
                      <div className="flex items-center justify-center h-16 text-sm text-muted-foreground">
                        할 일 없음
                      </div>
                    ) : (
                      dateTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-start gap-3 rounded-md border p-3 hover:bg-accent/50 transition-colors"
                        >
                          <Checkbox
                            checked={todo.completed}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium ${todo.completed ? "line-through opacity-60" : ""}`}>
                              {todo.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={`text-xs ${priorityColors[todo.priority]}`}>
                                {priorityLabels[todo.priority]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 추가 버튼 (오른쪽 끝) */}
                  <button
                    onClick={() => handleAddClick(date)}
                    className="rounded-full p-2 hover:bg-primary/10 text-primary transition-colors shrink-0"
                    title="할 일 추가"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 안내 */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 text-sm text-muted-foreground">
          💡 <strong>팁:</strong> 각 날짜의 + 버튼을 클릭하여 해당 날짜에 할 일을 빠르게 추가할 수 있습니다. 추가된 할 일은 할 일 페이지에서도 확인할 수 있습니다.
        </CardContent>
      </Card>
    </main>
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
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium">마감일</label>
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
