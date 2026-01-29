"use client";
// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addDays, format } from "date-fns";
import Link from "next/link";
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTimelineStore, type TimelineState, type TimelineItem, dateToKey } from "@/lib/store/timeline";

export default function WeeklyTimelineCard() {
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

  // 스토어에서 전체를 구독하고, 현재 날짜로 메모이제이션해서 필터링해요.
  // 이유: selector에 매번 다른 값(currentDate)을 넣으면 dev에서 getServerSnapshot 경고/루프가 날 수 있어요.
  const allItems = useTimelineStore((s: TimelineState) => s.items);
  const dateKey = dateToKey(currentDate);
  const items = React.useMemo(() => allItems.filter((it) => it.date === dateKey), [allItems, dateKey]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>오늘 할 일</CardTitle>
        <div className="flex items-center gap-2">
          <button aria-label="이전 날" className="rounded-md border p-1 hover:bg-accent shrink-0" onClick={() => move(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0 text-center text-sm text-muted-foreground truncate whitespace-nowrap">{currentDay} · {dateLabel}</div>
          <button aria-label="다음 날" className="rounded-md border p-1 hover:bg-accent shrink-0" onClick={() => move(1)}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link href="/timeline" className="ml-2 text-sm text-primary hover:underline shrink-0">상세 보기</Link>
        </div>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="space-y-3 min-w-0">
          <div className="text-sm text-muted-foreground">{currentDay} 일정 · {dateLabel}</div>
          <div className="rounded-lg border bg-card p-3 min-w-0">
            {items.length === 0 ? (
              <div className="flex h-28 items-center justify-center text-sm text-muted-foreground">비어있음</div>
            ) : (
              <div className="flex flex-col gap-2 min-w-0">
                {items.map((w: TimelineItem, idx: number) => (
                    <div key={idx} className="rounded-md border-0 bg-background/80 p-2 min-w-0">
                      <div className="text-xs text-muted-foreground">
                        {w.start} - {w.end}
                      </div>
                      <div className="mt-1 text-sm font-medium truncate break-keep" title={w.title}>{w.title}</div>
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
