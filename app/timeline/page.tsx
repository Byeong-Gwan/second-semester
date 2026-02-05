"use client";

import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTimelineStore, type TimelineItem, type TimelineType, dateToKey } from "@/lib/store/timeline";
import { addDays, startOfWeek, format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus, Trash2, Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

const typeLabels: Record<TimelineType, string> = {
  study: "스터디",
  language: "어학",
  solo: "개인학습",
  project: "프로젝트",
  etc: "기타",
};

const typeColors: Record<TimelineType, string> = {
  study: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  language: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  solo: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  project: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  etc: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
};

export default function TimelinePage() {
  const { items, remove, toggleDone } = useTimelineStore();
  const [showModal, setShowModal] = React.useState(false);
  const [weekOffset, setWeekOffset] = React.useState(0);

  const today = new Date();
  const weekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekItems = items.filter((item) => {
    const weekKeys = weekDays.map((d) => dateToKey(d));
    return weekKeys.includes(item.date);
  });

  const handlePrevWeek = () => setWeekOffset((o) => o - 1);
  const handleNextWeek = () => setWeekOffset((o) => o + 1);
  const handleToday = () => setWeekOffset(0);

  return (
    <CardDetailLayout
      title="타임라인"
      description="주간 일정을 관리하고 완료 여부를 체크합니다."
      actions={
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} />
          일정 추가
        </button>
      }
    >
      {showModal && <TimelineModal onClose={() => setShowModal(false)} />}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">주간 뷰</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              className="rounded-md border p-2 hover:bg-accent"
              aria-label="이전 주"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleToday}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
            >
              오늘
            </button>
            <span className="text-sm text-muted-foreground">
              {format(weekStart, "yyyy년 M월 d일", { locale: ko })} ~{" "}
              {format(addDays(weekStart, 6), "M월 d일", { locale: ko })}
            </span>
            <button
              onClick={handleNextWeek}
              className="rounded-md border p-2 hover:bg-accent"
              aria-label="다음 주"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          {weekDays.map((day, idx) => {
            const dayKey = dateToKey(day);
            const dayItems = items.filter((it) => it.date === dayKey);
            const isToday = dateToKey(day) === dateToKey(today);

            return (
              <Card key={idx} className={isToday ? "border-primary" : ""}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    {format(day, "EEE", { locale: ko })}
                    <div className="text-xs text-muted-foreground">{format(day, "M/d")}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {dayItems.length === 0 ? (
                    <div className="text-xs text-muted-foreground">일정 없음</div>
                  ) : (
                    dayItems.map((item) => (
                      <TimelineItemCard key={item.id} item={item} onRemove={remove} onToggle={toggleDone} />
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">전체 일정 목록</h2>
        <Card>
          <CardContent className="pt-6">
            {items.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                일정이 없습니다. 일정을 추가해보세요!
              </div>
            ) : (
              <div className="space-y-2">
                {items
                  .slice()
                  .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))
                  .map((item) => (
                    <TimelineItemRow key={item.id} item={item} onRemove={remove} onToggle={toggleDone} />
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </CardDetailLayout>
  );
}

function TimelineItemCard({
  item,
  onRemove,
  onToggle,
}: {
  item: TimelineItem;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={`rounded-md border p-2 text-xs ${typeColors[item.type]}`}>
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <Checkbox
              checked={item.done ?? false}
              onCheckedChange={() => onToggle(item.id)}
              className="h-3 w-3"
            />
            <span className={`font-medium truncate ${item.done ? "line-through opacity-60" : ""}`}>
              {item.title}
            </span>
          </div>
          <div className="mt-1 text-[10px] opacity-70">
            {item.start} - {item.end}
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="shrink-0 rounded p-0.5 hover:bg-destructive/20"
          aria-label="삭제"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

function TimelineItemRow({
  item,
  onRemove,
  onToggle,
}: {
  item: TimelineItem;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent/50">
      <Checkbox checked={item.done ?? false} onCheckedChange={() => onToggle(item.id)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${item.done ? "line-through opacity-60" : ""}`}>{item.title}</span>
          <Badge variant="outline" className={`text-xs ${typeColors[item.type]}`}>
            {typeLabels[item.type]}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {item.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {item.start} - {item.end}
          </span>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 rounded-md p-2 hover:bg-destructive/20 text-destructive"
        aria-label="삭제"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function TimelineModal({ onClose }: { onClose: () => void }) {
  const { add } = useTimelineStore();
  const [formData, setFormData] = React.useState({
    date: format(new Date(), "yyyy-MM-dd"),
    start: "09:00",
    end: "10:00",
    title: "",
    type: "study" as TimelineType,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    add(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold">일정 추가</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="일정 제목"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">날짜</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">시작 시간</label>
              <input
                type="time"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">종료 시간</label>
              <input
                type="time"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">타입</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as TimelineType })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            >
              {Object.entries(typeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
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
