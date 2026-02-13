"use client";

import React from "react";
import { useAttendanceStore } from "@/lib/store/attendance";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";

export default function AttendanceTab() {
  const { records, markAttendance, removeAttendance, getAttendanceRate, getStreak, getMonthStats, autoMarkAbsentForPastDays } = useAttendanceStore();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    autoMarkAbsentForPastDays();
  }, [autoMarkAbsentForPastDays]);

  if (!mounted) return <div className="animate-pulse h-40 bg-muted rounded-xl" />;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const attendanceRate = getAttendanceRate();
  const streak = getStreak();
  const monthStats = getMonthStats(year, month);

  const getStatusForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return records.find((r) => r.date === dateStr);
  };

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = getStatusForDate(date);
    if (!existing) {
      markAttendance(dateStr, "present");
    } else if (existing.status === "present") {
      markAttendance(dateStr, "late");
    } else if (existing.status === "late") {
      markAttendance(dateStr, "absent");
    } else {
      removeAttendance(dateStr);
    }
  };

  return (
    <div className="space-y-4">
      {/* 핵심 통계 */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Flame className="h-5 w-5 mx-auto text-red-500 mb-1" />
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{streak}일</div>
            <p className="text-xs text-muted-foreground">연속 출석</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <CheckCircle className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <div className={`text-2xl font-bold ${
              attendanceRate >= 90 ? "text-green-600 dark:text-green-400" :
              attendanceRate >= 70 ? "text-yellow-600 dark:text-yellow-400" :
              "text-gray-600"
            }`}>{attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">출석률</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <XCircle className="h-5 w-5 mx-auto text-red-500 mb-1" />
            <div className="text-2xl font-bold">{monthStats.absent}일</div>
            <p className="text-xs text-muted-foreground">이달 결석</p>
          </CardContent>
        </Card>
      </div>

      {/* 캘린더 */}
      <Card>
        <CardContent className="p-4">
          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2.5 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{format(currentDate, "yyyy년 M월", { locale: ko })}</span>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-accent transition-colors"
              >
                오늘
              </button>
            </div>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2.5 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((i) => <div key={`empty-${i}`} />)}
            {daysInMonth.map((date) => {
              const status = getStatusForDate(date);
              const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDayClick(date)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all active:scale-90 min-h-[44px] ${
                    isToday ? "ring-2 ring-primary ring-offset-1" : ""
                  } ${
                    status?.status === "present" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-semibold" :
                    status?.status === "late" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-semibold" :
                    status?.status === "absent" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-semibold" :
                    "hover:bg-accent"
                  }`}
                >
                  <span>{format(date, "d")}</span>
                  {status && (
                    <span className="mt-0.5">
                      {status.status === "present" && <CheckCircle className="h-3 w-3" />}
                      {status.status === "late" && <Clock className="h-3 w-3" />}
                      {status.status === "absent" && <XCircle className="h-3 w-3" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 범례 */}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span>출석</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>지각</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>결석</span>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">날짜를 탭하여 상태 변경</p>
        </CardContent>
      </Card>

      {/* 이번 달 통계 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3">이번 달 통계</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">{monthStats.present}</div>
              <p className="text-xs text-muted-foreground">출석</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{monthStats.late}</div>
              <p className="text-xs text-muted-foreground">지각</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">{monthStats.absent}</div>
              <p className="text-xs text-muted-foreground">결석</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{monthStats.rate}%</div>
              <p className="text-xs text-muted-foreground">출석률</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
