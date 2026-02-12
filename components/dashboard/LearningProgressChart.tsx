"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useLearningStore } from "@/lib/store/learnings";
import { BookOpen } from "lucide-react";

export function LearningProgressChart() {
  const learnings = useLearningStore((s) => s.learnings);

  const data = learnings.map((learning) => ({
    name: learning.title.length > 15 ? learning.title.substring(0, 15) + "..." : learning.title,
    progress: learning.progress,
    fullName: learning.title,
  }));

  const getColor = (progress: number) => {
    if (progress >= 80) return "hsl(142, 76%, 36%)";
    if (progress >= 50) return "hsl(47, 96%, 53%)";
    return "hsl(0, 84%, 60%)";
  };

  if (learnings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>학습 진행률</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[300px] items-center justify-center text-center space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">학습을 추가하세요</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                학습을 추가하면 여기에 각 학습의 진행률이 막대 차트로 표시됩니다
              </p>
            </div>
            <a
              href="/mypage"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              학습 추가하기
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>학습 진행률</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis domain={[0, 100]} className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="text-sm font-medium">{payload[0].payload.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        진행률: {payload[0].value}%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.progress)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
