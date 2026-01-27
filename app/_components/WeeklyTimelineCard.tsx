"use client";
// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addDays, format } from "date-fns";
import Link from "next/link";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WeeklyTimelineCard() {
  // 일주일 스케줄이에요. 요일(day)마다 시작/끝 시간과 제목(title), 종류(type)이 있어요.
  const weekly = [
    { day: "월", start: "19:30", end: "21:00", title: "알고리즘 스터디", type: "study" },
    { day: "화", start: "20:00", end: "22:00", title: "토익 LC", type: "language" },
    { day: "목", start: "19:00", end: "20:30", title: "CS정리", type: "solo" },
    { day: "토", start: "10:00", end: "12:00", title: "프로젝트 작업", type: "project" },
  ];

  const days = ["월", "화", "수", "목", "금", "토", "일"];

  // 오늘 기준으로 보여주고, 좌우 버튼으로 전/다음 날을 볼 수 있어요.
  const todayJs = new Date();
  const jsToKor = (d: number) => ["일", "월", "화", "수", "목", "금", "토"][d];
  const initialIndex = days.indexOf(jsToKor(todayJs.getDay()));
  const [index, setIndex] = React.useState(initialIndex === -1 ? 0 : initialIndex);
  const currentDay = days[index];
  const move = (delta: number) => setIndex((i) => (i + delta + days.length) % days.length);
  const currentDate = addDays(todayJs, index - (initialIndex === -1 ? 0 : initialIndex));
  const dateLabel = format(currentDate, "yyyy.MM.dd");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>오늘 할 일</CardTitle>
        <div className="flex items-center gap-2">
          <button aria-label="이전 날" className="rounded-md border p-1 hover:bg-accent" onClick={() => move(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="text-sm text-muted-foreground w-36 text-center">{currentDay} · {dateLabel}</div>
          <button aria-label="다음 날" className="rounded-md border p-1 hover:bg-accent" onClick={() => move(1)}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link href="/timeline" className="ml-2 text-sm text-primary hover:underline">상세 보기</Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">{currentDay} 일정 · {dateLabel}</div>
          <div className="rounded-lg border bg-card p-3">
            {weekly.filter((w) => w.day === currentDay).length === 0 ? (
              <div className="flex h-28 items-center justify-center text-sm text-muted-foreground">비어있음</div>
            ) : (
              <div className="flex flex-col gap-2">
                {weekly
                  .filter((w) => w.day === currentDay)
                  .map((w, idx) => (
                    <div key={idx} className="rounded-md border bg-background/80 p-2">
                      <div className="text-xs text-muted-foreground">
                        {w.start} - {w.end}
                      </div>
                      <div className="mt-1 text-sm font-medium">{w.title}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{w.type}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    );
}
