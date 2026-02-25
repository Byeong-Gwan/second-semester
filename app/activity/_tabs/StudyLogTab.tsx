"use client";

import React from "react";
import { useStudyLogStore } from "@/lib/store/studyLog";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock, BookOpen, Trash2 } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ko } from "date-fns/locale";

export default function StudyLogTab() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [mounted, setMounted] = React.useState(false);

  const { getLogsByDate, getTotalDurationByDate, getSubjectDurationByDate, deleteLog } = useStudyLogStore();

  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="animate-pulse h-40 bg-muted rounded-xl" />;

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const logs = getLogsByDate(dateStr);
  const totalMinutes = getTotalDurationByDate(dateStr);
  const subjectDurations = getSubjectDurationByDate(dateStr);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    if (mins === 0) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  };

  const handleDelete = (id: string) => {
    if (confirm("이 학습 기록을 삭제하시겠습니까?")) {
      deleteLog(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* 날짜 선택 */}
      <div className="flex items-center justify-between">
        <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2.5 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <button
            onClick={() => setSelectedDate(new Date())}
            className="text-lg font-bold hover:text-primary transition-colors"
          >
            {format(selectedDate, "M월 d일 (EEE)", { locale: ko })}
          </button>
        </div>
        <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2.5 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* 오늘의 요약 */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-blue-500 mb-1" />
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatDuration(totalMinutes)}</div>
            <p className="text-xs text-muted-foreground">총 학습 시간</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <BookOpen className="h-5 w-5 mx-auto text-purple-500 mb-1" />
            <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{logs.length}개</div>
            <p className="text-xs text-muted-foreground">학습 세션</p>
          </CardContent>
        </Card>
      </div>

      {/* 과목별 학습 시간 */}
      {Object.keys(subjectDurations).length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">과목별 학습 시간</h3>
            {Object.entries(subjectDurations)
              .sort(([, a], [, b]) => b - a)
              .map(([subject, minutes]) => (
                <div key={subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{subject}</span>
                    <span className="text-muted-foreground">{formatDuration(minutes)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${totalMinutes > 0 ? (minutes / totalMinutes) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* 학습 기록 목록 */}
      {logs.length === 0 ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">이 날짜에 학습 기록이 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{log.subject}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {log.startTime} ~ {log.endTime} · {formatDuration(log.duration)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 안내 */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            위에서 날짜와 시간을 선택하여 학습 기록을 추가하세요.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
