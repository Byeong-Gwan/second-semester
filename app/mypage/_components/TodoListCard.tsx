"use client";
// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
import { ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

export default function TodoListCard() {

  const todos = [
    { id: 1, title: "알고리즘 1문제 풀기", done: false },
    { id: 2, title: "영어 리스닝 30분", done: true },
    { id: 3, title: "React 문서 2섹션 읽기", done: false },
    { id: 4, title: "스터디 회의 정리", done: false },
  ];

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ListChecks /> 오늘의 투두
            </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
        {/* 체크박스에 체크하면 완료된 일로 표시돼요. */}
        {todos.map((todo) => (
            <div key={todo.id} className="flex items-center gap-3">
            <Checkbox checked={todo.done} onCheckedChange={()=>{}} />
            <span className={todo.done ? "text-muted-foreground line-through" : ""}>{todo.title}</span>
            </div>
        ))}
        </CardContent>
    </Card>
  );
}
