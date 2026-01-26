// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import React from "react";
import MainProgressCard from "./_components/MainProgressCard";
import WeeklyTimelineCard from "./_components/WeeklyTimelineCard";
import Header from "./header"
import TodoListCard from "./_components/TodoListCard"
import AttendanceCard from "./_components/AttendanceCard"


export default function DashboardPage() {
  return (
    // 화면의 큰 영역을 만드는 곳이에요.
    <main className="container space-y-6 py-8">
      <Header />
      <MainProgressCard />

      <div className="grid gap-6 md:grid-cols-2">
        <TodoListCard />
        <AttendanceCard />
      </div>

      <WeeklyTimelineCard />
    </main>
  );
}