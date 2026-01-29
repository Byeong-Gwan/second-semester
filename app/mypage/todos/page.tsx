// 이 파일은 '할 일' 화면을 그리는 곳이에요.
// 오늘 해야 할 것들을 모아 보고, 체크해서 완료할 수 있어요.
import React from "react";
import { CardDetailLayout } from "@/components/detail/CardDetailLayout";

export const metadata = {
  title: "할 일 | Second Semester",
  description: "할 일을 관리하고 완료율을 확인하세요.",
};

export default function TodosPage() {
  return (
    // 화면의 기본 틀 안에 컨트롤/차트/목록 순서로 보여줘요.
    <CardDetailLayout title="할 일" description="필터/검색으로 할 일을 정리합니다.">
      {/* 1) 컨트롤: 보고 싶은 것만 골라보도록 도와줘요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">컨트롤</h2>
        <div className="rounded-md border p-4 text-sm text-muted-foreground">필터/검색 컨트롤 영역 (placeholder)</div>
      </section>

      {/* 2) 완료율: 얼마나 해냈는지 원 모양으로 보여줄 거예요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">완료율</h2>
        <div className="rounded-md border p-8 text-sm text-muted-foreground">도넛 차트 영역 (placeholder)</div>
      </section>

      {/* 3) 목록: 해야 할 일들을 한 줄씩 보여줘요. */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">목록</h2>
        <div className="rounded-md border p-4 text-sm text-muted-foreground">할 일 리스트 영역 (placeholder)</div>
      </section>
    </CardDetailLayout>
  );
}
