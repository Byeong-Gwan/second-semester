"use client";
// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function WeeklyTimelineCard() {
  // 일주일 스케줄이에요. 요일(day)마다 시작/끝 시간과 제목(title), 종류(type)이 있어요.
  const weekly = [
    { day: "월", start: "19:30", end: "21:00", title: "알고리즘 스터디", type: "study" },
    { day: "화", start: "20:00", end: "22:00", title: "토익 LC", type: "language" },
    { day: "목", start: "19:00", end: "20:30", title: "CS정리", type: "solo" },
    { day: "토", start: "10:00", end: "12:00", title: "프로젝트 작업", type: "project" },
  ];

  const days = ["월", "화", "수", "목", "금", "토", "일"];

  return (
      
    <Card>
        {/* 이번 주 스케줄 타임라인 */}
        <CardHeader>
            <CardTitle>이번 주 스케줄 타임라인</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-7 gap-4">
            {days.map((d) => (
                <div key={d} className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">{d}</div>
                <div className="h-40 rounded-md border bg-muted/20 p-2">
                    {weekly.filter((week) => week.day === d).length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">비어있음</div>
                    ) : (
                    <div className="flex flex-col gap-2">
                        {weekly
                        .filter((week) => week.day === d)
                        .map((week, idx) => (
                            // 일정 카드예요. 너무 긴 제목은 "..."으로 깔끔하게 보여줘요.
                            <div key={idx} className="rounded-md border bg-card/80 p-2 overflow-hidden">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{week.start} - {week.end}</span>
                                <span className="uppercase tracking-wide">{week.type}</span>
                            </div>
                            <div className="text-sm font-medium truncate" title={week.title}>{week.title}</div>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
                </div>
            ))}
            </div>
        </CardContent>
    </Card>
    );
}
