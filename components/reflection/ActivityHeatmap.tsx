"use client";

import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";

interface ActivityHeatmapProps {
  reflections: Array<{ date: string }>;
  monthsToShow?: number;
}

export function ActivityHeatmap({ reflections, monthsToShow = 3 }: ActivityHeatmapProps) {
  const today = new Date();
  const startDate = startOfMonth(subMonths(today, monthsToShow - 1));
  const endDate = endOfMonth(today);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // 날짜별 회고 개수 계산
  const reflectionCountByDate = reflections.reduce((acc, reflection) => {
    const date = reflection.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 레벨별 색상 (GitHub 스타일)
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-teal-200 dark:bg-teal-900/40";
    if (count === 2) return "bg-teal-400 dark:bg-teal-700/60";
    return "bg-teal-600 dark:bg-teal-500";
  };

  // 주차별로 그룹화
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day, index) => {
    if (index === 0) {
      // 첫 주 시작 전 빈 칸 채우기
      const dayOfWeek = day.getDay();
      for (let i = 0; i < dayOfWeek; i++) {
        currentWeek.push(new Date(0)); // 빈 날짜
      }
    }
    
    currentWeek.push(day);
    
    if (day.getDay() === 6 || index === days.length - 1) {
      // 토요일이거나 마지막 날
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">회고 활동</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>적음</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-teal-200 dark:bg-teal-900/40" />
            <div className="w-3 h-3 rounded-sm bg-teal-400 dark:bg-teal-700/60" />
            <div className="w-3 h-3 rounded-sm bg-teal-600 dark:bg-teal-500" />
          </div>
          <span>많음</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const dateStr = format(day, "yyyy-MM-dd");
                const count = reflectionCountByDate[dateStr] || 0;
                const isEmpty = day.getTime() === 0;
                const isFuture = day > today;

                if (isEmpty) {
                  return <div key={dayIndex} className="w-3 h-3" />;
                }

                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm transition-all hover:ring-2 hover:ring-teal-500 cursor-pointer ${
                      isFuture ? "bg-muted/50" : getColorClass(count)
                    }`}
                    title={`${format(day, "yyyy년 M월 d일", { locale: ko })}: ${count}개 회고`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        최근 {monthsToShow}개월 동안 {reflections.length}개의 회고 작성
      </div>
    </div>
  );
}
