// 이 파일은 '진행 현황' 화면을 그리는 곳이에요.
// 쉽게 말해, 성적표처럼 이번 학기의 상황을 보기 좋게 보여줘요.
import React from "react";
import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { differenceInCalendarDays, format } from "date-fns";

export const metadata = {
  title: "진행 현황 | Second Semester",
  description: "학기 진행률과 기간 통계를 확인하세요.",
};

export default function ProgressPage() {
  // 가짜(연습용) 데이터로 요약을 보여줘요.
  const today = new Date();
  const semester = {
    name: "2026 Q1 세컨드 학기",
    start: new Date(today.getFullYear(), 0, 2),
    end: new Date(today.getFullYear(), 2, 31),
    progress: 42,
  };
  const dday = differenceInCalendarDays(semester.end, today);
  const elapsed = Math.max(0, differenceInCalendarDays(today, semester.start));
  const total = Math.max(1, differenceInCalendarDays(semester.end, semester.start));
  const remaining = Math.max(0, total - elapsed);

  // 주/월간 등 간단한 목데이터(최근 8구간의 진행률)예요.
  const history = [10, 14, 18, 22, 27, 33, 38, 42];

  // 아주 간단한 SVG 라인 차트 컴포넌트예요.
  function LineChart({ values, width = 600, height = 180 }: { values: number[]; width?: number; height?: number }) {
    const padding = 16;
    const w = width - padding * 2;
    const h = height - padding * 2;
    const max = Math.max(1, Math.max(...values));
    const stepX = w / Math.max(1, values.length - 1);
    const pts = values.map((v, i) => {
      const x = padding + i * stepX;
      const y = padding + (1 - v / max) * h; // 값이 클수록 위로
      return `${x},${y}`;
    });
    const path = `M ${pts.join(" L ")}`;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[180px]">
        {/* 배경선(가이드) */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} className="stroke-muted" strokeWidth={1} />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-muted" strokeWidth={1} />
        {/* 라인 */}
        <path d={path} className="stroke-primary fill-none" strokeWidth={2} />
        {/* 마지막 값 점 강조 */}
        {pts.length > 0 ? (
          <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r={3} className="fill-primary" />
        ) : null}
      </svg>
    );
  }

  return (
    // 화면의 기본 틀(CardDetailLayout) 안에 여러 칸(섹션)을 넣어줘요.
    <CardDetailLayout title="진행 현황" description="학기 진행률, 기간 통계, 추이를 확인합니다.">
      {/* 1) 요약: 중요한 정보들을 한눈에 보여줘요. */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">요약(Summary)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">전체 진행률</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>진행률</span>
                <Badge variant="outline">{semester.progress}%</Badge>
              </div>
              <Progress value={semester.progress} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">학기 기간</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {format(semester.start, "yyyy.MM.dd")} ~ {format(semester.end, "yyyy.MM.dd")}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">D-DAY</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">D-{dday}</CardContent>
          </Card>
        </div>
      </section>

      {/* 2) 추이: 시간이 지나면서 어떻게 변했는지 그래프로 보여줄 거예요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">진행률 추이</h2>
        <div className="rounded-md border p-4">
          <LineChart values={history} />
          <p className="mt-2 text-xs text-muted-foreground">최근 진행률 변화 (목데이터)</p>
        </div>
      </section>

      {/* 3) 통계: 남은 일수, 지난 일수 같은 숫자 정보를 모아 보여줘요. */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">기간 통계</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">총 일수</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{total}일</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">지난 일수</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{elapsed}일</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">남은 일수</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{remaining}일</CardContent>
          </Card>
        </div>
      </section>
    </CardDetailLayout>
  );
}
