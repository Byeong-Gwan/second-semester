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
  BookOpen,
  BarChart3,
  Award,
  Zap,
  ArrowRight,
  XCircle
} from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { LearningProgressChart } from "@/components/dashboard/LearningProgressChart";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { TodoCompletionChart } from "@/components/dashboard/TodoCompletionChart";

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  
  const learnings = useLearningStore((s) => s.learnings);
  const { todos, getCompletionRate, toggleTodo } = useTodoStore();
  const { records, getAttendanceRate, getMonthRecords, markAttendance, removeAttendance, autoMarkAbsentForPastDays } = useAttendanceStore();

  React.useEffect(() => {
    setMounted(true);
    // 페이지 로드 시 자동으로 과거 미체크 날짜를 결석으로 처리
    autoMarkAbsentForPastDays();
  }, [autoMarkAbsentForPastDays]);

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
  
  const learningProgress = calculateLearningProgress(learnings);
  const weeklyTodoCompletion = calculateWeeklyTodoCompletion(todos);
  const achievements = calculateAchievements(attendanceRate, completionRate, streak, activeLearnings.length);

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
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                이번 주 출석 현황
              </CardTitle>
              <Link 
                href="/activity?tab=attendance" 
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                출석 체크하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-400 dark:bg-gray-600" />
                <span>미체크</span>
              </div>
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {weekAttendance.map(({ date, status }) => {
                const isTodayDate = isToday(date);
                const dateStr = format(date, "yyyy-MM-dd");
                
                const handleCircleClick = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  if (!status) {
                    markAttendance(dateStr, "present");
                  } else if (status === "present") {
                    markAttendance(dateStr, "late");
                  } else if (status === "late") {
                    markAttendance(dateStr, "absent");
                  } else {
                    removeAttendance(dateStr);
                  }
                };
                
                return (
                  <div
                    key={date.toISOString()}
                    className={`
                      flex flex-col items-center p-3 rounded-lg border-2 bg-muted/50
                      ${isTodayDate ? "ring-2 ring-primary" : "border-border"}
                    `}
                  >
                    <div className="text-xs text-muted-foreground">
                      {format(date, "EEE", { locale: ko })}
                    </div>
                    <div className="text-lg font-bold mt-1">
                      {format(date, "d")}
                    </div>
                    <button
                      onClick={handleCircleClick}
                      className="mt-1 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                      aria-label="출석 상태 변경"
                    >
                      {status === "present" && (
                        <div className="w-8 h-8 rounded-full bg-green-500 shadow-md" />
                      )}
                      {status === "late" && (
                        <div className="w-8 h-8 rounded-full bg-yellow-500 shadow-md" />
                      )}
                      {status === "absent" && (
                        <div className="w-8 h-8 rounded-full bg-red-500 shadow-md" />
                      )}
                      {!status && (
                        <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 shadow-md" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            {weekAttendance.every(w => !w.status) && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">
                  아직 출석 체크를 하지 않았어요. 
                  <Link href="/activity?tab=attendance" className="text-primary hover:underline ml-1">
                    출석 관리 페이지
                  </Link>
                  에서 캘린더 날짜를 클릭하여 출석 체크하세요!
                </p>
              </div>
            )}
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
              href="/activity?tab=todos"
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
                  href="/activity?tab=todos"
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
                    onClick={() => toggleTodo(todo.id)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer
                      ${todo.completed ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" : 
                        todo.priority === "high" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/30" :
                        todo.priority === "medium" ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-950/30" :
                        "bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-950/30"}
                      transition-all hover:scale-[1.02]
                    `}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTodo(todo.id);
                      }}
                      className="flex-shrink-0 hover:scale-110 transition-transform"
                      aria-label="할 일 완료 토글"
                    >
                      <div className={`
                        h-6 w-6 rounded-full border-2 flex items-center justify-center
                        ${todo.completed ? "bg-gradient-to-br from-green-400 to-green-600 border-green-500 shadow-lg shadow-green-500/50" : 
                          todo.priority === "high" ? "border-red-500" :
                          todo.priority === "medium" ? "border-yellow-500" :
                          "border-gray-400"}
                      `}>
                        {todo.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                    </button>
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
                    href="/activity?tab=todos"
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
              href="/activity?tab=learning"
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
                  href="/activity?tab=learning"
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

      {/* 학습 진행률 분석 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              학습 진행률 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            {learnings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>진행 중인 학습이 없습니다</p>
              </div>
            ) : (
              <div className="space-y-4">
                {learnings.slice(0, 5).map((learning) => (
                  <div key={learning.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/mypage/learning/${learning.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {learning.title}
                      </Link>
                      <div className="flex items-center gap-2">
                        <Badge variant={learning.joined ? "default" : "secondary"}>
                          {learning.joined ? "참여 중" : "미참여"}
                        </Badge>
                        <span className="text-sm font-semibold">{learning.progress}%</span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                          learning.progress >= 80 ? "bg-green-500" :
                          learning.progress >= 50 ? "bg-blue-500" :
                          learning.progress >= 30 ? "bg-yellow-500" :
                          "bg-gray-400"
                        }`}
                        style={{ width: `${learning.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {learning.startDate} ~ {learning.endDate}
                    </p>
                  </div>
                ))}
                {learningProgress.average > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">평균 진행률</span>
                      <span className="font-bold text-lg">{learningProgress.average}%</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 주간 할 일 완료 트렌드 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              주간 할 일 완료 트렌드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {weeklyTodoCompletion.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">
                      {format(day.date, "EEE", { locale: ko })}
                    </div>
                    <div className="relative h-24 bg-muted rounded-lg overflow-hidden">
                      <div
                        className={`absolute inset-x-0 bottom-0 rounded-t-lg transition-all ${
                          day.rate >= 80 ? "bg-green-500" :
                          day.rate >= 50 ? "bg-blue-500" :
                          day.rate >= 30 ? "bg-yellow-500" :
                          "bg-gray-400"
                        }`}
                        style={{ height: `${day.rate}%` }}
                      />
                    </div>
                    <div className="text-xs font-semibold mt-2">{day.rate}%</div>
                    <div className="text-xs text-muted-foreground">
                      {day.completed}/{day.total}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">주간 평균 완료율</span>
                <span className="text-lg font-bold">
                  {Math.round(weeklyTodoCompletion.reduce((sum, day) => sum + day.rate, 0) / 7)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 성과 및 달성 현황 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              성과 및 달성 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.achieved
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-300 dark:border-yellow-700"
                      : "bg-muted/50 border-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-3xl ${
                      achievement.achieved ? "" : "opacity-30 grayscale"
                    }`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {achievement.achieved ? (
                        <Badge className="bg-yellow-500 text-white">
                          <Trophy className="h-3 w-3 mr-1" />
                          달성!
                        </Badge>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {achievement.progress}/{achievement.target}
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 차트 분석 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">📊 상세 분석</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <LearningProgressChart />
          <AttendanceChart />
        </div>
        <TodoCompletionChart />
      </section>

      {/* 빠른 액션 */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/activity?tab=todos">
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

        <Link href="/activity?tab=attendance">
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

function calculateLearningProgress(learnings: any[]): { average: number; total: number } {
  if (learnings.length === 0) return { average: 0, total: 0 };
  const total = learnings.reduce((sum, l) => sum + l.progress, 0);
  return {
    average: Math.round(total / learnings.length),
    total: learnings.length
  };
}

function calculateWeeklyTodoCompletion(todos: any[]): Array<{ date: Date; total: number; completed: number; rate: number }> {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  return weekDays.map(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayTodos = todos.filter(t => t.dueDate === dateStr);
    const completed = dayTodos.filter(t => t.completed).length;
    const total = dayTodos.length;
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    return { date: day, total, completed, rate };
  });
}

function calculateAchievements(
  attendanceRate: number,
  completionRate: number,
  streak: number,
  activeLearnings: number
): Array<{
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
  progress: number;
  target: number;
}> {
  return [
    {
      title: "완벽한 출석",
      description: "출석률 90% 이상 달성",
      icon: "🎯",
      achieved: attendanceRate >= 90,
      progress: attendanceRate,
      target: 90
    },
    {
      title: "할 일 마스터",
      description: "할 일 완료율 80% 이상 달성",
      icon: "✅",
      achieved: completionRate >= 80,
      progress: completionRate,
      target: 80
    },
    {
      title: "연속 출석 챔피언",
      description: "7일 연속 출석 달성",
      icon: "🔥",
      achieved: streak >= 7,
      progress: streak,
      target: 7
    },
    {
      title: "학습 열정가",
      description: "3개 이상의 학습 참여",
      icon: "📚",
      achieved: activeLearnings >= 3,
      progress: activeLearnings,
      target: 3
    }
  ];
}
