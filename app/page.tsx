"use client";

import React from "react";
import Link from "next/link";
import { useLearningStore } from "@/lib/store/learnings";
import { useTodoStore } from "@/lib/store/todos";
import { useAttendanceStore } from "@/lib/store/attendance";
import { useReflectionStore } from "@/lib/store/reflection";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, CheckSquare, UserCheck, Flame, ArrowRight,
  CheckCircle2, PenLine, Layers, Cloud, Newspaper
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function TodayPage() {
  const [mounted, setMounted] = React.useState(false);

  const learnings = useLearningStore((s) => s.learnings);
  const { todos, toggleTodo, getCompletionRate } = useTodoStore();
  const { getAttendanceRate, getStreak, records, markAttendance } = useAttendanceStore();
  const { getAllReflections, getReflectionByDate } = useReflectionStore();

  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="container max-w-3xl py-6 px-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-muted rounded-2xl" />
          <div className="h-32 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const completionRate = getCompletionRate();
  const attendanceRate = getAttendanceRate();
  const streak = getStreak();
  const todayReflection = getReflectionByDate(todayStr);
  const todayTodos = todos.filter((t) => t.dueDate === todayStr);
  const activeLearnings = learnings.filter((l) => l.joined);
  const todayAttendance = records.find((r) => r.date === todayStr);

  const hasAnyData = learnings.length > 0 || todos.length > 0 || records.length > 0;

  return (
    <div className="container max-w-3xl py-6 px-4 space-y-5">
      {/* 인사말 */}
      <section>
        <h1 className="text-2xl font-bold">
          {format(today, "M월 d일 EEEE", { locale: ko })}
        </h1>
        <p className="text-muted-foreground mt-1">오늘도 화이팅! 💪</p>
      </section>

      {/* 핵심 지표 3개 */}
      <section className="grid grid-cols-3 gap-3">
        <Card className={`border-2 ${streak > 0 ? "border-red-200 dark:border-red-800" : ""}`}>
          <CardContent className="p-3 text-center">
            <Flame className="h-5 w-5 mx-auto text-red-500 mb-1" />
            <div className="text-xl font-bold">{streak}일</div>
            <p className="text-[11px] text-muted-foreground">연속 출석</p>
          </CardContent>
        </Card>
        <Card className={`border-2 ${completionRate >= 80 ? "border-green-200 dark:border-green-800" : ""}`}>
          <CardContent className="p-3 text-center">
            <CheckSquare className="h-5 w-5 mx-auto text-green-500 mb-1" />
            <div className="text-xl font-bold">{completionRate}%</div>
            <p className="text-[11px] text-muted-foreground">할 일 완료</p>
          </CardContent>
        </Card>
        <Card className={`border-2 ${attendanceRate >= 90 ? "border-blue-200 dark:border-blue-800" : ""}`}>
          <CardContent className="p-3 text-center">
            <UserCheck className="h-5 w-5 mx-auto text-blue-500 mb-1" />
            <div className="text-xl font-bold">{attendanceRate}%</div>
            <p className="text-[11px] text-muted-foreground">출석률</p>
          </CardContent>
        </Card>
      </section>

      {/* 오늘 출석 체크 */}
      {!todayAttendance && (
        <button
          onClick={() => markAttendance(todayStr, "present")}
          className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white font-semibold text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all min-h-[56px]"
        >
          <UserCheck className="h-6 w-6" />
          오늘 출석 체크하기
        </button>
      )}
      {todayAttendance?.status === "present" && (
        <div className="flex items-center gap-3 rounded-2xl bg-green-50 dark:bg-green-950/20 border-2 border-green-200 dark:border-green-800 p-4">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <p className="font-semibold text-green-700 dark:text-green-400">오늘 출석 완료!</p>
            <p className="text-xs text-green-600/70 dark:text-green-400/70">{streak}일 연속 출석 중 �</p>
          </div>
        </div>
      )}

      {/* 오늘의 할 일 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">오늘의 할 일</h2>
          <Link href="/activity?tab=todos" className="text-sm text-primary font-medium flex items-center gap-1">
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {todayTodos.length === 0 ? (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">오늘 예정된 할 일이 없습니다</p>
              <Link href="/activity?tab=todos" className="text-sm text-primary font-medium mt-2 inline-block">
                할 일 추가하기 →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {todayTodos.slice(0, 5).map((todo) => (
              <Card key={todo.id} className={todo.completed ? "opacity-60" : ""}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        todo.completed ? "bg-green-500 border-green-500" :
                        todo.priority === "high" ? "border-red-400" :
                        todo.priority === "medium" ? "border-yellow-400" : "border-gray-300"
                      }`}>
                        {todo.completed && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                    </button>
                    <span className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : "font-medium"}`}>
                      {todo.title}
                    </span>
                    <Badge variant="outline" className={`text-xs ${
                      todo.priority === "high" ? "border-red-400 text-red-600" :
                      todo.priority === "medium" ? "border-yellow-400 text-yellow-600" : "border-gray-300"
                    }`}>
                      {todo.priority === "high" ? "🔥" : todo.priority === "medium" ? "보통" : "낮음"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 진행 중인 학습 */}
      {activeLearnings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">진행 중인 학습</h2>
            <Link href="/activity?tab=learning" className="text-sm text-primary font-medium flex items-center gap-1">
              전체 보기 <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {activeLearnings.slice(0, 3).map((learning) => (
              <Card key={learning.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{learning.title}</h3>
                    <span className="text-sm font-bold shrink-0 ml-2">{learning.progress}%</span>
                  </div>
                  <Progress value={learning.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 오늘 회고 작성 유도 */}
      {!todayReflection && (
        <Link href="/activity?tab=reflection">
          <Card className="border-2 border-dashed border-teal-200 dark:border-teal-800 hover:border-teal-400 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                <PenLine className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">오늘의 회고를 작성해보세요</p>
                <p className="text-xs text-muted-foreground">하루를 돌아보며 성장하세요</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </CardContent>
          </Card>
        </Link>
      )}

      {/* 시작 가이드 - 데이터 없을 때 */}
      {!hasAnyData && (
        <section className="rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/10 p-6 space-y-4">
          <div className="text-center space-y-2">
            <span className="text-3xl">🚀</span>
            <h2 className="text-xl font-bold">시작해볼까요?</h2>
            <p className="text-sm text-muted-foreground">아래 활동 탭에서 데이터를 추가하세요</p>
          </div>
          <Link
            href="/activity"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all min-h-[52px]"
          >
            <Layers className="h-5 w-5" />
            활동 시작하기
          </Link>
        </section>
      )}

      {/* 빠른 링크 */}
      {hasAnyData && (
        <section className="grid grid-cols-2 gap-3">
          <Link href="/dashboard">
            <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-colors h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">대시보드</p>
                  <p className="text-xs text-muted-foreground">차트 보기</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/mypage/report">
            <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-colors h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <Flame className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">성과 리포트</p>
                  <p className="text-xs text-muted-foreground">인사이트</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      )}

      {/* 날씨/뉴스 요약 */}
      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">오늘의 일상</h2>
          <Link href="/daily" className="text-sm text-primary font-medium flex items-center gap-1">
            전체 보기 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 날씨 카드 */}
          <Link href="/weather" className="block">
            <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-colors h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Cloud className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">날씨</p>
                    <WeatherSummary />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* 뉴스 카드 */}
          <Link href="/news" className="block">
            <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-colors h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                    <Newspaper className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">뉴스</p>
                    <NewsSummary />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}

// 날씨 요약 컴포넌트
function WeatherSummary() {
  const [weather, setWeather] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => {
        if (data?.current) setWeather(data.current);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-muted-foreground">로딩 중...</p>;
  if (!weather) return <p className="text-xs text-muted-foreground">정보 없음</p>;
  
  return (
    <p className="text-xs text-muted-foreground">
      {weather.temp}°C · {weather.description}
    </p>
  );
}

// 뉴스 요약 컴포넌트
function NewsSummary() {
  const [news, setNews] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [displayCount, setDisplayCount] = React.useState(1);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setDisplayCount(mobile ? 1 : 2);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setNews(data.items.slice(0, 10));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-muted-foreground">로딩 중...</p>;
  if (news.length === 0) return <p className="text-xs text-muted-foreground">뉴스 없음</p>;
  
  return (
    <div className="space-y-1">
      {news.slice(0, displayCount).map((item, index) => (
        <p key={index} className="text-xs text-muted-foreground truncate">
          {item.title?.slice(0, 25)}...
        </p>
      ))}
      {displayCount < news.length && news.length > displayCount && (
        <button 
          onClick={() => setDisplayCount(prev => prev + 1)}
          className="text-xs text-primary hover:underline"
        >
          더보기
        </button>
      )}
    </div>
  );
}