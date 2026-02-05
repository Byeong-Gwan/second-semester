"use client";

import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAttendanceStore } from "@/lib/store/attendance";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react";
import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from "date-fns";
import { ko } from "date-fns/locale";

export default function AttendancePage() {
  const { records, markAttendance, removeAttendance, getAttendanceRate, allowedAbsences, getUsedAbsences, getRemainingAbsences } = useAttendanceStore();
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

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">통계</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">출석률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{attendanceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                총 {records.length}일 중 {records.filter((r) => r.status === "present").length}일 출석
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">결석 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {usedAbsences} / {allowedAbsences}
              </div>
              <p className="text-xs text-muted-foreground mt-1">남은 결석 {remainingAbsences}회</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">지각</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{records.filter((r) => r.status === "late").length}회</div>
              <p className="text-xs text-muted-foreground mt-1">총 지각 횟수</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </CardDetailLayout>
  );
}
