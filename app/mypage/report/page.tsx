"use client";

import React from "react";
import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLearningStore } from "@/lib/store/learnings";
import { useTodoStore } from "@/lib/store/todos";
import { useAttendanceStore } from "@/lib/store/attendance";
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target, 
  Calendar,
  CheckCircle2,
  BookOpen,
  Flame,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { ko } from "date-fns/locale";
import { LearningProgressChart } from "@/components/dashboard/LearningProgressChart";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { TodoCompletionChart } from "@/components/dashboard/TodoCompletionChart";

export default function ReportPage() {
  const [mounted, setMounted] = React.useState(false);
  
  const learnings = useLearningStore((s) => s.learnings);
  const { todos, getCompletionRate } = useTodoStore();
  const { records, getAttendanceRate, getStreak, getMonthStats } = useAttendanceStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <CardDetailLayout title="성과 리포트" description="학습 성과를 분석합니다">
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-muted rounded-lg" />
          <div className="h-40 bg-muted rounded-lg" />
        </div>
      </CardDetailLayout>
    );
  }

  const today = new Date();
  const completionRate = getCompletionRate();
  const attendanceRate = getAttendanceRate();
  const streak = getStreak();
  const monthStats = getMonthStats(today.getFullYear(), today.getMonth() + 1);

  const activeLearnings = learnings.filter((l) => l.joined);
  const completedLearnings = learnings.filter((l) => l.progress === 100);
  const avgProgress = learnings.length > 0 
    ? Math.round(learnings.reduce((sum, l) => sum + l.progress, 0) / learnings.length)
    : 0;

  const completedTodos = todos.filter((t) => t.completed).length;
  const highPriorityCompleted = todos.filter((t) => t.completed && t.priority === "high").length;
  const highPriorityTotal = todos.filter((t) => t.priority === "high").length;

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    return format(date, "yyyy-MM-dd");
  });

  const dailyActivity = last30Days.map((date) => {
    const dayTodos = todos.filter((t) => t.dueDate === date);
    const dayAttendance = records.find((r) => r.date === date);
    return {
      date,
      todos: dayTodos.length,
      completed: dayTodos.filter((t) => t.completed).length,
      attended: dayAttendance?.status === "present" || dayAttendance?.status === "late",
    };
  });

  const activeWeeks = dailyActivity.filter((d) => d.todos > 0 || d.attended).length;
  const productivityScore = Math.round(
    (attendanceRate * 0.3 + completionRate * 0.4 + avgProgress * 0.3)
  );

  const insights = generateInsights(
    attendanceRate,
    completionRate,
    streak,
    avgProgress,
    activeLearnings.length,
    highPriorityCompleted,
    highPriorityTotal
  );

  return (
    <CardDetailLayout 
      title="성과 리포트" 
      description={`${format(today, "yyyy년 M월", { locale: ko })} 학습 성과 분석`}
    >
      {/* 종합 점수 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Award className="h-5 w-5" />
          종합 생산성 점수
        </h2>
        <Card className="border-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-purple-600 dark:text-purple-400">
                {productivityScore}
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <Progress value={productivityScore} className="h-3 [&>div]:bg-purple-500" />
              <p className="text-sm text-muted-foreground">
                {productivityScore >= 90 ? "🏆 탁월함" :
                 productivityScore >= 70 ? "🌟 우수함" :
                 productivityScore >= 50 ? "👍 양호함" :
                 "💪 개선 필요"}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 핵심 지표 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          핵심 지표
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                출석률
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {attendanceRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {monthStats.present}일 출석
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                할 일 완료율
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {completionRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedTodos}/{todos.length} 완료
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                평균 진행률
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {avgProgress}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {learnings.length}개 학습
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flame className="h-4 w-4 text-red-600" />
                연속 출석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {streak}일
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                현재 기록
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 학습 성과 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          학습 성과
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">진행 중</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeLearnings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">활성 학습</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">완료</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {completedLearnings.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">100% 달성</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">평균 진행률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {avgProgress}%
              </div>
              <Progress value={avgProgress} className="mt-2 h-2 [&>div]:bg-purple-500" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 할 일 성과 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5" />
          할 일 성과
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">전체 완료율</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {completionRate}%
              </div>
              <Progress value={completionRate} className="mt-2 h-2 [&>div]:bg-blue-500" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">완료한 할 일</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedTodos}</div>
              <p className="text-xs text-muted-foreground mt-1">총 {todos.length}개 중</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">높은 우선순위</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {highPriorityCompleted}/{highPriorityTotal}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {highPriorityTotal > 0 
                  ? `${Math.round((highPriorityCompleted / highPriorityTotal) * 100)}% 완료`
                  : "없음"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 차트 분석 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          시각화 분석
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <LearningProgressChart />
          <AttendanceChart />
        </div>
        <TodoCompletionChart />
      </section>

      {/* 인사이트 및 제안 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          인사이트 및 제안
        </h2>
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className={`border-2 ${insight.type === "success" ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20" : insight.type === "warning" ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20" : "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20"}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {insight.type === "success" ? "✅" : insight.type === "warning" ? "⚠️" : "💡"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                    {insight.suggestion && (
                      <p className="text-sm text-primary mt-2 font-medium">
                        💡 {insight.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 활동 요약 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">최근 30일 활동</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold">{activeWeeks}</div>
                <p className="text-sm text-muted-foreground mt-1">활동 일수</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {monthStats.present}
                </div>
                <p className="text-sm text-muted-foreground mt-1">출석 일수</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {completedTodos}
                </div>
                <p className="text-sm text-muted-foreground mt-1">완료한 할 일</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </CardDetailLayout>
  );
}

function generateInsights(
  attendanceRate: number,
  completionRate: number,
  streak: number,
  avgProgress: number,
  activeLearnings: number,
  highPriorityCompleted: number,
  highPriorityTotal: number
): Array<{ type: "success" | "warning" | "info"; title: string; message: string; suggestion?: string }> {
  const insights: Array<{ type: "success" | "warning" | "info"; title: string; message: string; suggestion?: string }> = [];

  if (attendanceRate >= 90) {
    insights.push({
      type: "success",
      title: "완벽한 출석률!",
      message: `출석률 ${attendanceRate}%로 매우 우수합니다. 꾸준한 학습 습관이 형성되었습니다.`,
    });
  } else if (attendanceRate < 70) {
    insights.push({
      type: "warning",
      title: "출석률 개선 필요",
      message: `현재 출석률은 ${attendanceRate}%입니다. 목표 달성을 위해 더 자주 출석해보세요.`,
      suggestion: "매일 같은 시간에 출석 체크하는 습관을 만들어보세요.",
    });
  }

  if (streak >= 7) {
    insights.push({
      type: "success",
      title: `${streak}일 연속 출석 달성!`,
      message: "놀라운 성과입니다! 이 기록을 계속 유지해보세요.",
    });
  } else if (streak === 0) {
    insights.push({
      type: "info",
      title: "연속 출석 시작하기",
      message: "매일 출석하여 연속 기록을 만들어보세요. 작은 습관이 큰 변화를 만듭니다.",
      suggestion: "오늘부터 출석 체크를 시작해보세요!",
    });
  }

  if (completionRate >= 80) {
    insights.push({
      type: "success",
      title: "할 일 관리 우수",
      message: `할 일 완료율 ${completionRate}%로 매우 체계적으로 관리하고 있습니다.`,
    });
  } else if (completionRate < 50) {
    insights.push({
      type: "warning",
      title: "할 일 완료율 낮음",
      message: `현재 완료율은 ${completionRate}%입니다. 우선순위를 정하고 하나씩 완료해보세요.`,
      suggestion: "높은 우선순위 할 일부터 집중해서 처리해보세요.",
    });
  }

  if (avgProgress >= 70) {
    insights.push({
      type: "success",
      title: "학습 진행 순조로움",
      message: `평균 진행률 ${avgProgress}%로 학습이 잘 진행되고 있습니다.`,
    });
  } else if (avgProgress < 30 && activeLearnings > 0) {
    insights.push({
      type: "warning",
      title: "학습 진행 속도 점검",
      message: `평균 진행률이 ${avgProgress}%로 낮습니다. 학습 계획을 재점검해보세요.`,
      suggestion: "하루에 조금씩이라도 꾸준히 학습하는 것이 중요합니다.",
    });
  }

  if (activeLearnings === 0) {
    insights.push({
      type: "info",
      title: "새로운 학습 시작하기",
      message: "현재 진행 중인 학습이 없습니다. 새로운 학습을 시작해보세요!",
      suggestion: "관심 있는 주제로 학습을 만들어보세요.",
    });
  } else if (activeLearnings > 5) {
    insights.push({
      type: "warning",
      title: "학습 개수 많음",
      message: `현재 ${activeLearnings}개의 학습을 진행 중입니다. 너무 많은 학습은 집중력을 떨어뜨릴 수 있습니다.`,
      suggestion: "2-3개의 핵심 학습에 집중하는 것을 추천합니다.",
    });
  }

  if (highPriorityTotal > 0) {
    const highPriorityRate = Math.round((highPriorityCompleted / highPriorityTotal) * 100);
    if (highPriorityRate >= 80) {
      insights.push({
        type: "success",
        title: "우선순위 관리 탁월",
        message: `높은 우선순위 할 일을 ${highPriorityRate}% 완료했습니다.`,
      });
    } else if (highPriorityRate < 50) {
      insights.push({
        type: "warning",
        title: "중요한 할 일 먼저",
        message: "높은 우선순위 할 일의 완료율이 낮습니다. 중요한 일부터 처리해보세요.",
        suggestion: "매일 아침 가장 중요한 할 일 1-2개를 먼저 완료하세요.",
      });
    }
  }

  return insights;
}
