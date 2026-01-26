"use client";
// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ThemeToggle } from "@/components/theme-toggle";
import React from "react";

export default function Header() {
  // 여기는 가짜 데이터(연습용 정보)예요. 진짜 서버가 없어도 보여줄 수 있게 준비했어요.
  const today = new Date();
  const semester = {
    name: "2026 Q1 세컨드 학기",
    start: new Date(today.getFullYear(), 0, 2),
    end: new Date(today.getFullYear(), 2, 31),
    progress: 42,
  };

  return (
    // 화면의 큰 영역을 만드는 곳이에요.
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{semester.name}</h1>
          <p className="text-sm text-muted-foreground">{format(semester.start, "PPP", { locale: ko })} - {format(semester.end, "PPP", { locale: ko })}</p>
        </div>
        {/* 이 버튼을 누르면 밝게/어둡게 바뀌어요. */}
        <ThemeToggle />
      </header>
  );
}
