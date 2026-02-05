"use client";
// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoStore } from "@/lib/store/todos";
import Link from "next/link";
import React from "react";

export default function TodoListCard() {
  const { getTodayTodos, toggleTodo } = useTodoStore();
  const todayTodos = getTodayTodos();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <ListChecks /> 오늘의 할 일
        </CardTitle>
        <Link href="/mypage/todos" className="text-sm text-primary hover:underline">
          상세 보기
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {todayTodos.length === 0 ? (
          <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
            오늘 마감인 할 일이 없습니다
          </div>
        ) : (
          todayTodos.slice(0, 5).map((todo) => (
            <div key={todo.id} className="flex items-center gap-3">
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
              <span className={todo.completed ? "text-muted-foreground line-through" : ""}>{todo.title}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
