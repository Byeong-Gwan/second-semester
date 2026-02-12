"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLearningStore } from "@/lib/store/learnings";
import { useTodoStore } from "@/lib/store/todos";
import { useTimelineStore } from "@/lib/store/timeline";
import { useAttendanceStore } from "@/lib/store/attendance";
import { BookOpen, Calendar, CheckSquare, UserCheck, ArrowRight, BarChart3, Trophy, Clock } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  
  const learnings = useLearningStore((s) => s.learnings);
  const todos = useTodoStore((s) => s.todos);
  const timelineItems = useTimelineStore((s) => s.items);
  const { getAttendanceRate } = useAttendanceStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const stats = {
    learnings: learnings.length,
    activeLearnings: learnings.filter((l) => l.joined).length,
    todos: todos.length,
    activeTodos: todos.filter((t) => !t.completed).length,
    timeline: timelineItems.length,
    todayTimeline: timelineItems.filter((t) => t.date === new Date().toISOString().split("T")[0]).length,
    attendanceRate: mounted ? getAttendanceRate() : 0,
  };

  if (!mounted) {
    return (
      <main className="container max-w-5xl space-y-8 py-8">
        <section className="text-center space-y-2 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Second Semester</h1>
          <p className="text-sm sm:text-base text-muted-foreground">학습, 일정, 할 일, 출석을 한눈에 관리하세요</p>
        </section>
      </main>
    );
  }

  const hasAnyData = stats.learnings > 0 || stats.todos > 0 || stats.timeline > 0 || stats.attendanceRate > 0;

  return (
    <main className="container max-w-5xl space-y-8 py-8">
      {/* 헤더 */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
          <span className="text-3xl font-bold text-white">2S</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Second Semester</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          학습, 일정, 할 일, 출석을 한눈에 관리하는 스마트 플래너
        </p>
        {!hasAnyData && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            시작하기: 아래 카드를 클릭하여 데이터를 추가하세요
          </div>
        )}
      </section>

      {/* 대시보드 카드 */}
      <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* 학습 관리 */}
        <DashboardCard
          icon={<BookOpen className="h-8 w-8" />}
          title="학습 관리"
          description="내 학습 목록과 진행 상황"
          stats={[
            { label: "전체 학습", value: stats.learnings },
            { label: "참여 중", value: stats.activeLearnings },
          ]}
          action="학습 보러가기"
          onClick={() => router.push("/mypage")}
        />

        {/* 학습 일지 */}
        <DashboardCard
          icon={<Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />}
          title="학습 일지"
          description="시간별 학습 기록"
          stats={[]}
          action="일지 보러가기"
          onClick={() => router.push("/mypage/study-log")}
        />

        {/* 학습 회고 */}
        <DashboardCard
          icon={<BookOpen className="h-8 w-8 text-teal-600 dark:text-teal-400" />}
          title="학습 회고"
          description="하루 학습 돌아보기"
          stats={[]}
          action="회고 작성하기"
          onClick={() => router.push("/mypage/reflection")}
        />

        {/* 타임라인 */}
        <DashboardCard
          icon={<Calendar className="h-8 w-8" />}
          title="타임라인"
          description="주간 일정과 스케줄"
          stats={[
            { label: "전체 일정", value: stats.timeline },
            { label: "오늘 일정", value: stats.todayTimeline },
          ]}
          action="일정 보러가기"
          onClick={() => router.push("/mypage/timeline")}
        />

        {/* 할 일 */}
        <DashboardCard
          icon={<CheckSquare className="h-8 w-8" />}
          title="할 일"
          description="오늘의 할 일과 완료율"
          stats={[
            { label: "전체 할 일", value: stats.todos },
            { label: "남은 할 일", value: stats.activeTodos },
          ]}
          action="할 일 보러가기"
          onClick={() => router.push("/mypage/todos")}
        />

        {/* 출석 */}
        <DashboardCard
          icon={<UserCheck className="h-8 w-8" />}
          title="출석 체크"
          description="출석률과 결석 현황"
          stats={[{ label: "출석률", value: `${stats.attendanceRate}%` }]}
          action="출석 보러가기"
          onClick={() => router.push("/mypage/attendance")}
        />
      </section>

      {/* 시작 가이드 - 데이터가 없을 때 */}
      {!hasAnyData && (
        <section className="rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
              <span className="text-2xl">🚀</span>
            </div>
            <h2 className="text-2xl font-bold">환영합니다!</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Second Semester를 시작하려면 아래 단계를 따라해보세요
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-blue-100 dark:border-blue-900 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold">학습 추가</h3>
              <p className="text-sm text-muted-foreground">
                공부하고 싶은 과목이나 주제를 추가하세요
              </p>
              <button
                onClick={() => router.push("/mypage")}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                학습 만들기
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-purple-100 dark:border-purple-900 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold">할 일 작성</h3>
              <p className="text-sm text-muted-foreground">
                오늘 해야 할 일을 작성하고 관리하세요
              </p>
              <button
                onClick={() => router.push("/mypage/todos")}
                className="w-full rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                할 일 추가
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-orange-100 dark:border-orange-900 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold">출석 체크</h3>
              <p className="text-sm text-muted-foreground">
                매일 출석을 체크하고 연속 기록을 쌓아보세요
              </p>
              <button
                onClick={() => router.push("/mypage/attendance")}
                className="w-full rounded-lg bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                출석하기
              </button>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>팁:</strong> 데이터를 추가하면 대시보드에서 차트와 통계를 확인할 수 있어요!
            </p>
          </div>
        </section>
      )}

      {/* 빠른 링크 - 데이터가 있을 때 */}
      {hasAnyData && (
        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/dashboard" className="group">
            <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-6 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">대시보드</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                차트와 통계로 학습 현황을 확인하세요
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                보러가기
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link href="/mypage/report" className="group">
            <div className="rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 p-6 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">성과 리포트</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                학습 성과와 인사이트를 확인하세요
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:gap-3 transition-all">
                보러가기
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link href="/weather" className="group">
            <div className="rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-6 transition-all hover:shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">일상 정보</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                날씨와 뉴스를 확인하세요
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 group-hover:gap-3 transition-all">
                보러가기
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </section>
      )}
    </main>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  stats,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  stats: { label: string; value: string | number }[];
  action: string;
  onClick: () => void;
}) {
  // 각 카드별 색상 테마
  const getCardTheme = () => {
    switch (title) {
      case "학습 관리":
        return {
          border: "border-blue-200 dark:border-blue-800 hover:border-blue-300",
          bg: "hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
          icon: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
          text: "text-blue-600 dark:text-blue-400"
        };
      case "타임라인":
        return {
          border: "border-purple-200 dark:border-purple-800 hover:border-purple-300",
          bg: "hover:bg-purple-50/50 dark:hover:bg-purple-950/20",
          icon: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30",
          text: "text-purple-600 dark:text-purple-400"
        };
      case "할 일":
        return {
          border: "border-green-200 dark:border-green-800 hover:border-green-300",
          bg: "hover:bg-green-50/50 dark:hover:bg-green-950/20",
          icon: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30",
          text: "text-green-600 dark:text-green-400"
        };
      case "출석 체크":
        return {
          border: "border-orange-200 dark:border-orange-800 hover:border-orange-300",
          bg: "hover:bg-orange-50/50 dark:hover:bg-orange-950/20",
          icon: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30",
          text: "text-orange-600 dark:text-orange-400"
        };
      case "학습 일지":
        return {
          border: "border-amber-200 dark:border-amber-800 hover:border-amber-300",
          bg: "hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
          icon: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
          text: "text-amber-600 dark:text-amber-400"
        };
      case "학습 회고":
        return {
          border: "border-teal-200 dark:border-teal-800 hover:border-teal-300",
          bg: "hover:bg-teal-50/50 dark:hover:bg-teal-950/20",
          icon: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30",
          text: "text-teal-600 dark:text-teal-400"
        };
      default:
        return {
          border: "border-border",
          bg: "hover:bg-accent/50",
          icon: "text-primary",
          text: "text-primary"
        };
    }
  };

  const theme = getCardTheme();

  return (
    <div
      onClick={onClick}
      className={`group rounded-xl border-2 p-6 bg-card cursor-pointer transition-all hover:shadow-lg ${theme.border} ${theme.bg}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${theme.icon}`}>
          {icon}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6">{description}</p>

      <div className="flex gap-6 mb-6">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className={`flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all ${theme.text}`}>
        {action}
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}