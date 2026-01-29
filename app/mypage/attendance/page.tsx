// 이 파일은 '출석' 화면을 그리는 곳이에요.
// 달력처럼 날짜를 보고, 왔는지 안 왔는지를 한눈에 확인해요.
import React from "react";
import { CardDetailLayout } from "@/components/detail/CardDetailLayout";

export const metadata = {
  title: "출석 | Second Semester",
  description: "출석 현황과 통계를 확인하세요.",
};

export default function AttendancePage() {
  return (
    // 큰 틀 안에 캘린더와 통계 칸을 나눠서 보여줘요.
    <CardDetailLayout title="출석" description="월간 캘린더와 통계를 확인합니다.">
      {/* 1) 캘린더: 하루하루 출석/결석을 표시해요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">캘린더</h2>
        <div className="rounded-md border p-8 text-sm text-muted-foreground">월간 캘린더 영역 (placeholder)</div>
      </section>

      {/* 2) 통계: 출석률과 연속 출석 같은 숫자를 보여줘요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">통계</h2>
        <div className="rounded-md border p-4 text-sm text-muted-foreground">출석률/연속 출석 통계 카드 영역 (placeholder)</div>
      </section>
    </CardDetailLayout>
  );
}
