"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useLearningStore } from "@/lib/store/learnings";
import { useTodoStore } from "@/lib/store/todos";
import { useTimelineStore } from "@/lib/store/timeline";
import { useAttendanceStore } from "@/lib/store/attendance";
import { BookOpen, Calendar, CheckSquare, UserCheck, ArrowRight } from "lucide-react";

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
        <section className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Second Semester</h1>
          <p className="text-muted-foreground">로딩 중...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container max-w-5xl space-y-8 py-8">
      {/* 헤더 */}
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Second Semester</h1>
        <p className="text-muted-foreground">학습, 일정, 할 일, 출석을 한눈에 관리하세요</p>
      </section>

      {/* 대시보드 카드 */}
      <section className="grid gap-6 md:grid-cols-2">
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

      {/* 빠른 시작 가이드 */}
      {stats.learnings === 0 && stats.todos === 0 && stats.timeline === 0 && (
        <section className="rounded-lg border border-dashed p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold">시작하기</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            위 카드를 클릭하여 각 영역으로 이동하고, 학습을 추가하거나 일정을 만들어보세요!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => router.push("/mypage")}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
            >
              학습 만들기
            </button>
            <button
              onClick={() => router.push("/mypage/timeline")}
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              일정 추가하기
            </button>
            <button
              onClick={() => router.push("/mypage/todos")}
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              할 일 추가하기
            </button>
          </div>
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
  return (
    <div
      onClick={onClick}
      className="group rounded-lg border p-6 bg-card hover:bg-accent/50 cursor-pointer transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-primary">{icon}</div>
      </div>

      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="flex gap-6 mb-4">
        {stats.map((stat, i) => (
          <div key={i}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
        {action}
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}