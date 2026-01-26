"use client";
// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import { differenceInCalendarDays } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ListChecks } from "lucide-react";
import React from "react";

export default function MainProgressCard() {
  // 여기는 가짜 데이터(연습용 정보)예요. 진짜 서버가 없어도 보여줄 수 있게 준비했어요.
  const today = new Date();
  const semester = {
    name: "2026 Q1 세컨드 학기",
    start: new Date(today.getFullYear(), 0, 2),
    end: new Date(today.getFullYear(), 2, 31),
    progress: 42,
  };
  const dday = differenceInCalendarDays(semester.end, today);

    const todos = [
{ id: 1, title: "알고리즘 1문제 풀기", done: false },
{ id: 2, title: "영어 리스닝 30분", done: true },
{ id: 3, title: "React 문서 2섹션 읽기", done: false },
{ id: 4, title: "스터디 회의 정리", done: false },
];

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="text-primary" />
            이번 학기 진행 상황
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge className="uppercase" variant="outline">D-{dday}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>전체 진행률</span>
                <span className="text-muted-foreground">{semester.progress}%</span>
              </div>
              <Progress value={semester.progress} />
            </div>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-4">
              <ListChecks className="text-primary" />
              <div className="text-sm text-muted-foreground">오늘 해야 할 일 {todos.filter(todo=>!todo.done).length}개 남음</div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
