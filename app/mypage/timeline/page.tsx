// 이 파일은 '타임라인' 화면을 그리는 곳이에요.
// 요일표처럼 이번 주나 이번 달의 일정을 한눈에 보여줘요.
import React from "react";
import { CardDetailLayout } from "@/components/detail/CardDetailLayout";

export const metadata = {
  title: "타임라인 | Second Semester",
  description: "주간/월간 일정 타임라인을 확인하세요.",
};

export default function TimelinePage() {
  return (
    // 큰 틀 안에 뷰 전환/태그/일정 순서로 보여줘요.
    <CardDetailLayout title="타임라인" description="주간/월간 전환과 태그 필터를 제공합니다.">
      {/* 1) 뷰 전환: 주간 보기/월간 보기로 바꿔볼 수 있어요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">뷰 전환</h2>
        <div className="rounded-md border p-4 text-sm text-muted-foreground">주간/월간 전환 탭 (placeholder)</div>
      </section>

      {/* 2) 태그 필터: 공부/운동 같은 종류별로 골라볼 수 있어요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">태그 필터</h2>
        <div className="rounded-md border p-4 text-sm text-muted-foreground">태그 필터 컨트롤 (placeholder)</div>
      </section>

      {/* 3) 일정: 약속과 할 일을 시간 순서대로 볼 수 있어요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">일정</h2>
        <div className="rounded-md border p-8 text-sm text-muted-foreground">일정 리스트/타임라인 영역 (placeholder)</div>
      </section>
    </CardDetailLayout>
  );
}
