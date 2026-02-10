"use client";

import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttendanceStore } from "@/lib/store/attendance";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Flame, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import { ko } from "date-fns/locale";

export default function AttendancePage() {
  const { records, markAttendance, removeAttendance, getAttendanceRate, allowedAbsences, getUsedAbsences, getRemainingAbsences, getMonthStats, getWeekStats, getStreak } = useAttendanceStore();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfWeek = getDay(monthStart);
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

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

  const attendanceRate = getAttendanceRate();
  const usedAbsences = getUsedAbsences();
  const remainingAbsences = getRemainingAbsences();
  const monthStats = getMonthStats(year, month);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const weekStats = getWeekStats(weekStart);
  const streak = getStreak();

  return (
    <CardDetailLayout title="출석" description="월간 캘린더와 통계를 확인합니다.">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">캘린더</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="rounded-md border p-2 hover:bg-accent" aria-label="이전 달">
              <ChevronLeft size={16} />
            </button>
            <button onClick={handleToday} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
              오늘
            </button>
            <span className="text-sm font-medium">
              {format(currentDate, "yyyy년 M월", { locale: ko })}
            </span>
            <button onClick={handleNextMonth} className="rounded-md border p-2 hover:bg-accent" aria-label="다음 달">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-7 gap-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}

              {emptyDays.map((i) => (
                <div key={`empty-${i}`} />
              ))}

              {daysInMonth.map((date) => {
                const status = getStatusForDate(date);
                const isToday = format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDayClick(date)}
                    className={`
                      aspect-square rounded-md p-2 text-sm transition-colors
                      ${isToday ? "ring-2 ring-primary" : ""}
                      ${status?.status === "present" ? "bg-green-500/20 text-green-700 dark:text-green-400" : ""}
                      ${status?.status === "late" ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" : ""}
                      ${status?.status === "absent" ? "bg-red-500/20 text-red-700 dark:text-red-400" : ""}
                      ${!status ? "hover:bg-accent" : ""}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span>{format(date, "d")}</span>
                      {status && (
                        <span className="mt-1">
                          {status.status === "present" && <CheckCircle size={12} />}
                          {status.status === "late" && <Clock size={12} />}
                          {status.status === "absent" && <XCircle size={12} />}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-green-600" />
                <span>출석</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-yellow-600" />
                <span>지각</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle size={14} className="text-red-600" />
                <span>결석</span>
              </div>
              <div className="ml-auto text-muted-foreground">클릭하여 상태 변경</div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 연속 출석 & 주요 통계 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">주요 통계</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">연속 출석</CardTitle>
              <Flame className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{streak}일 🔥</div>
              <p className="text-xs text-muted-foreground mt-1">
                {streak >= 7 ? "대단해요!" : "매일 출석해보세요"}
              </p>
            </CardContent>
          </Card>

          <Card className={`border-2 ${
            attendanceRate >= 90 ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" :
            attendanceRate >= 70 ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800" :
            "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800"
          }`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">전체 출석률</CardTitle>
              <TrendingUp className={`h-4 w-4 ${
                attendanceRate >= 90 ? "text-green-600" :
                attendanceRate >= 70 ? "text-yellow-600" :
                "text-gray-600"
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${
                attendanceRate >= 90 ? "text-green-600 dark:text-green-400" :
                attendanceRate >= 70 ? "text-yellow-600 dark:text-yellow-400" :
                "text-gray-600 dark:text-gray-400"
              }`}>{attendanceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                총 {records.length}일 중 {records.filter((r) => r.status === "present").length}일 출석
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">결석 현황</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {usedAbsences} / {allowedAbsences}
              </div>
              <p className="text-xs text-muted-foreground mt-1">남은 결석 {remainingAbsences}회</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">지각</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{records.filter((r) => r.status === "late").length}회</div>
              <p className="text-xs text-muted-foreground mt-1">총 지각 횟수</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 이번 주 통계 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">이번 주 통계</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{weekStats.present}일</div>
                <p className="text-xs text-muted-foreground mt-1">출석</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{weekStats.late}일</div>
                <p className="text-xs text-muted-foreground mt-1">지각</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{weekStats.absent}일</div>
                <p className="text-xs text-muted-foreground mt-1">결석</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{weekStats.rate}%</div>
                <p className="text-xs text-muted-foreground mt-1">출석률</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 이번 달 통계 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">이번 달 통계</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="text-center">
                <div className="text-2xl font-bold">{monthStats.total}일</div>
                <p className="text-xs text-muted-foreground mt-1">기록된 날</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{monthStats.present}일</div>
                <p className="text-xs text-muted-foreground mt-1">출석</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{monthStats.late}일</div>
                <p className="text-xs text-muted-foreground mt-1">지각</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{monthStats.absent}일</div>
                <p className="text-xs text-muted-foreground mt-1">결석</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{monthStats.rate}%</div>
                <p className="text-xs text-muted-foreground mt-1">출석률</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </CardDetailLayout>
  );
}
