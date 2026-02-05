"use client";
// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAttendanceStore } from "@/lib/store/attendance";
import Link from "next/link";
import React from "react";

export default function AttendanceCard() {
  const { allowedAbsences, getUsedAbsences, getRemainingAbsences } = useAttendanceStore();
  const usedAbsences = getUsedAbsences();
  const remaining = getRemainingAbsences();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 /> 출결 현황
        </CardTitle>
        <Link href="/mypage/attendance" className="text-sm text-primary hover:underline">
          상세 보기
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Badge variant="success">남은 결석 {remaining}회</Badge>
          <Separator className="w-4" orientation="vertical" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <TriangleAlert className="h-4 w-4 text-amber-400" />
            총 결석 허용 {allowedAbsences}회 중 {usedAbsences}회 사용
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          {/* 초록/빨강 막대로 남은 횟수와 사용한 횟수를 보여줘요. */}
          {Array.from({ length: allowedAbsences }).map((_, i) => (
            <div
              key={i}
              className={"h-3 w-6 rounded-sm " + (i < usedAbsences ? "bg-destructive/80" : "bg-emerald-600")}
              title={i < usedAbsences ? "사용됨" : "남음"}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
