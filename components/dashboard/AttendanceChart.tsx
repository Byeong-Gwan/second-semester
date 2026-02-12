"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useAttendanceStore } from "@/lib/store/attendance";
import { Calendar as CalendarIcon } from "lucide-react";

export function AttendanceChart() {
  const records = useAttendanceStore((s) => s.records);

  const presentCount = records.filter((r) => r.status === "present").length;
  const lateCount = records.filter((r) => r.status === "late").length;
  const absentCount = records.filter((r) => r.status === "absent").length;

  const data = [
    { name: "출석", value: presentCount, color: "hsl(142, 76%, 36%)" },
    { name: "지각", value: lateCount, color: "hsl(47, 96%, 53%)" },
    { name: "결석", value: absentCount, color: "hsl(0, 84%, 60%)" },
  ].filter((item) => item.value > 0);

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>출석 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[300px] items-center justify-center text-center space-y-4 p-6">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <CalendarIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">출석을 체크하세요</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                출석을 체크하면 여기에 출석/지각/결석 비율이 파이 차트로 표시됩니다
              </p>
            </div>
            <a
              href="/mypage/attendance"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition-colors"
            >
              <CalendarIcon className="h-4 w-4" />
              출석 체크하기
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>출석 통계</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
