"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTodoStore } from "@/lib/store/todos";
import { format, subDays, startOfDay } from "date-fns";
import { ko } from "date-fns/locale";
import { CheckSquare } from "lucide-react";

export function TodoCompletionChart() {
  const todos = useTodoStore((s) => s.todos);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return startOfDay(date);
  });

  const data = last7Days.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const todosForDay = todos.filter((t) => t.dueDate === dateStr);
    const completed = todosForDay.filter((t) => t.completed).length;
    const total = todosForDay.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      date: format(date, "M/d", { locale: ko }),
      fullDate: format(date, "M월 d일", { locale: ko }),
      rate,
      completed,
      total,
    };
  });

  const hasAnyTodos = todos.length > 0;

  if (!hasAnyTodos) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>주간 할 일 완료율</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[300px] items-center justify-center text-center space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">할 일을 추가하세요</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                할 일을 추가하고 완료하면 여기에 최근 7일간의 완료율 추이가 라인 차트로 표시됩니다
              </p>
            </div>
            <a
              href="/mypage/todos"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
            >
              <CheckSquare className="h-4 w-4" />
              할 일 추가하기
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>주간 할 일 완료율</CardTitle>
          <div className="text-xs text-muted-foreground">최근 7일</div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis domain={[0, 100]} className="text-xs" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="text-sm font-medium">{data.fullDate}</div>
                      <div className="text-sm text-muted-foreground">
                        완료율: {data.rate}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {data.completed}/{data.total} 완료
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
