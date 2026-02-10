"use client";

import React from "react";
import { useLearningStore } from "@/lib/store/learnings";
import { useTodoStore } from "@/lib/store/todos";
import { useAttendanceStore } from "@/lib/store/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  Clock, 
  Flame,
  Trophy,
  Calendar as CalendarIcon,
  BookOpen
} from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  
  const learnings = useLearningStore((s) => s.learnings);
  const { todos, getCompletionRate } = useTodoStore();
  const { getAttendanceRate, getMonthRecords } = useAttendanceStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="container max-w-6xl py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-40 bg-muted rounded-lg" />
            <div className="h-40 bg-muted rounded-lg" />
            <div className="h-40 bg-muted rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  const activeLearnings = learnings.filter((l) => l.joined);
  const activeTodos = todos.filter((t) => !t.completed);
  const completionRate = getCompletionRate();
  const attendanceRate = getAttendanceRate();
  
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const monthRecords = getMonthRecords(today.getFullYear(), today.getMonth() + 1);
  const weekAttendance = weekDays.map(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    const record = monthRecords.find(r => r.date === dateStr);
    return {
      date: day,
      status: record?.status || null
    };
  });

  const todayTodos = todos.filter(t => {
    if (!t.dueDate) return false;
    return t.dueDate === format(today, "yyyy-MM-dd");
  });

  const streak = calculateStreak(monthRecords);

  return (
    <main className="container max-w-6xl py-8 space-y-8">
      {/* 헤더 */}
      <section className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">대시보드</h1>
        <p className="text-lg text-muted-foreground">
          {format(today, "yyyy년 M월 d일 EEEE", { locale: ko })}
        </p>
      </section>

      {/* 핵심 지표 카드 */}
      <section className="grid gap-4 md:grid-cols-3">
        {/* 출석률 - 초록(성공) */}
        <Card className={`border-2 hover:shadow-lg transition-shadow ${
          attendanceRate >= 90 ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" :
          attendanceRate >= 70 ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800" :
          "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800"
        }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">출석률</CardTitle>
            <CalendarIcon className={`h-4 w-4 ${
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
            <Progress value={attendanceRate} className={`mt-2 h-2 ${
              attendanceRate >= 90 ? "[&>div]:bg-green-500" :
              attendanceRate >= 70 ? "[&>div]:bg-yellow-500" :
              "[&>div]:bg-gray-500"
            }`} />
            <p className="text-xs font-medium mt-2">
              {attendanceRate >= 90 ? "🎉 완벽해요!" : attendanceRate >= 70 ? "👍 잘하고 있어요" : "💪 조금만 더 힘내요"}
            </p>
          </CardContent>
        </Card>

        {/* 할 일 완료율 - 초록(성공) */}
        <Card className={`border-2 hover:shadow-lg transition-shadow ${
          completionRate >= 80 ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" :
          completionRate >= 50 ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800" :
          "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800"
        }`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">할 일 완료율</CardTitle>
            <CheckCircle2 className={`h-4 w-4 ${
              completionRate >= 80 ? "text-green-600" :
              completionRate >= 50 ? "text-yellow-600" :
              "text-gray-600"
            }`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${
              completionRate >= 80 ? "text-green-600 dark:text-green-400" :
              completionRate >= 50 ? "text-yellow-600 dark:text-yellow-400" :
              "text-gray-600 dark:text-gray-400"
            }`}>{completionRate}%</div>
            <Progress value={completionRate} className={`mt-2 h-2 ${
              completionRate >= 80 ? "[&>div]:bg-green-500" :
              completionRate >= 50 ? "[&>div]:bg-yellow-500" :
              "[&>div]:bg-gray-500"
            }`} />
            <p className="text-xs font-medium mt-2">
              {todos.filter(t => t.completed).length}개 완료 / {todos.length}개 전체
            </p>
          </CardContent>
        </Card>

        {/* 연속 출석 - 빨강(열정) */}
        <Card className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">연속 출석</CardTitle>
            <Flame className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {streak}일 🔥
            </div>
            <p className="text-xs font-medium mt-2">
              {streak >= 7 ? "대단해요! 계속 유지하세요!" : "매일 출석해서 기록을 늘려보세요"}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 이번 주 출석 현황 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              이번 주 출석 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekAttendance.map(({ date, status }) => {
                const isTodayDate = isToday(date);
                return (
                  <div
                    key={date.toISOString()}
                    className={`
                      flex flex-col items-center p-3 rounded-lg border-2
                      ${isTodayDate ? "ring-2 ring-primary" : ""}
                      ${status === "present" ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" : ""}
                      ${status === "late" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800" : ""}
                      ${status === "absent" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" : ""}
                      ${!status ? "bg-muted/50" : ""}
                    `}
                  >
                    <div className="text-xs text-muted-foreground">
                      {format(date, "EEE", { locale: ko })}
                    </div>
                    <div className="text-lg font-bold mt-1">
                      {format(date, "d")}
                    </div>
                    <div className="text-2xl mt-1">
                      {status === "present" ? "✅" : status === "late" ? "⏰" : status === "absent" ? "❌" : "⚪"}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 오늘의 할 일 */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              오늘의 할 일
              <Badge variant="secondary">{todayTodos.length}개</Badge>
            </CardTitle>
            <Link 
              href="/mypage/todos"
              className="text-sm text-primary hover:underline"
            >
              전체 보기 →
            </Link>
          </CardHeader>
          <CardContent>
            {todayTodos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>오늘 예정된 할 일이 없습니다</p>
                <Link 
                  href="/mypage/todos"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  할 일 추가하기
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTodos.slice(0, 5).map((todo) => (
                  <div
                    key={todo.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border-2
                      ${todo.completed ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" : 
                        todo.priority === "high" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/30" :
                        todo.priority === "medium" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-950/30" :
                        "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-950/30"}
                      transition-colors
                    `}
                  >
                    <div className={`
                      h-5 w-5 rounded-full border-2 flex items-center justify-center
                      ${todo.completed ? "bg-green-500 border-green-500" : 
                        todo.priority === "high" ? "border-red-500" :
                        todo.priority === "medium" ? "border-yellow-500" :
                        "border-gray-400"}
                    `}>
                      {todo.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                    <span className={`flex-1 ${todo.completed ? "line-through text-green-700 dark:text-green-400" : "font-medium"}`}>
                      {todo.title}
                    </span>
                    <Badge 
                      variant="outline"
                      className={
                        todo.priority === "high" ? "bg-red-100 border-red-500 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-semibold" :
                        todo.priority === "medium" ? "bg-yellow-100 border-yellow-500 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400" :
                        "bg-gray-100 border-gray-400 text-gray-700 dark:bg-gray-950/50 dark:text-gray-400"
                      }
                    >
                      {todo.priority === "high" ? "🔥 높음" : todo.priority === "medium" ? "보통" : "낮음"}
                    </Badge>
                  </div>
                ))}
                {todayTodos.length > 5 && (
                  <Link 
                    href="/mypage/todos"
                    className="block text-center text-sm text-primary hover:underline py-2"
                  >
                    +{todayTodos.length - 5}개 더 보기
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 진행 중인 학습 */}
      <section>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              진행 중인 학습
              <Badge variant="secondary">{activeLearnings.length}개</Badge>
            </CardTitle>
            <Link 
              href="/mypage"
              className="text-sm text-primary hover:underline"
            >
              전체 보기 →
            </Link>
          </CardHeader>
          <CardContent>
            {activeLearnings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>진행 중인 학습이 없습니다</p>
                <Link 
                  href="/"
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  학습 시작하기
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeLearnings.slice(0, 3).map((learning) => (
                  <Link
                    key={learning.id}
                    href={`/mypage/learning/${learning.id}`}
                    className="block p-4 rounded-lg border-2 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{learning.title}</h3>
                      <Badge variant="secondary">{learning.progress}%</Badge>
                    </div>
                    <Progress value={learning.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {learning.startDate} ~ {learning.endDate}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 빠른 액션 */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/mypage/todos">
          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">할 일 관리</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTodos.length}개 진행 중
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/mypage/attendance">
          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">출석 체크</h3>
                <p className="text-sm text-muted-foreground">
                  {streak}일 연속 출석 중
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>
    </main>
  );
}

function calculateStreak(records: Array<{ date: string; status: string }>): number {
  if (records.length === 0) return 0;
  
  const sortedRecords = [...records]
    .filter(r => r.status === "present" || r.status === "late")
    .sort((a, b) => b.date.localeCompare(a.date));
  
  if (sortedRecords.length === 0) return 0;
  
  let streak = 0;
  const today = format(new Date(), "yyyy-MM-dd");
  let currentDate = today;
  
  for (const record of sortedRecords) {
    if (record.date === currentDate || record.date < currentDate) {
      streak++;
      const date = new Date(record.date);
      date.setDate(date.getDate() - 1);
      currentDate = format(date, "yyyy-MM-dd");
    } else {
      break;
    }
  }
  
  return streak;
}
