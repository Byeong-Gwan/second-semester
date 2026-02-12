"use client";

import React from "react";
import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudyLogStore, StudyLogEntry } from "@/lib/store/studyLog";
import { 
  Plus, 
  Clock, 
  BookOpen, 
  Trash2, 
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from "lucide-react";
import { format, addDays, subDays, startOfWeek } from "date-fns";
import { ko } from "date-fns/locale";
import { CircularTimeline } from "@/components/study-log/CircularTimeline";

export default function StudyLogPage() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  const { 
    logs, 
    addLog, 
    updateLog, 
    deleteLog, 
    getLogsByDate, 
    getTotalDurationByDate,
    getSubjectDurationByDate 
  } = useStudyLogStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const todayLogs = mounted ? getLogsByDate(dateStr) : [];
  const totalMinutes = mounted ? getTotalDurationByDate(dateStr) : 0;
  const subjectDurations = mounted ? getSubjectDurationByDate(dateStr) : {};

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const handleToday = () => setSelectedDate(new Date());

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    if (mins === 0) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  };

  return (
    <CardDetailLayout 
      title="학습 일지" 
      description="시간별로 학습 내용을 기록하고 관리하세요"
    >
      {/* 날짜 선택 */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">날짜 선택</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button 
              onClick={handlePrevDay}
              className="rounded-md border p-2 hover:bg-accent"
              aria-label="이전 날"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleToday}
              className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
            >
              오늘
            </button>
            <span className="text-xs sm:text-sm font-medium min-w-[120px] sm:min-w-[140px] text-center">
              {format(selectedDate, "yyyy년 M월 d일 (EEE)", { locale: ko })}
            </span>
            <button 
              onClick={handleNextDay}
              className="rounded-md border p-2 hover:bg-accent"
              aria-label="다음 날"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 일일 통계 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">오늘의 학습</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                총 학습 시간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatDuration(totalMinutes)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {todayLogs.length}개 세션
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                학습 과목
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Object.keys(subjectDurations).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                과목 수
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">평균 세션</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {todayLogs.length > 0 
                  ? formatDuration(Math.round(totalMinutes / todayLogs.length))
                  : "0분"
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                세션당 평균
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 과목별 학습 시간 */}
      {Object.keys(subjectDurations).length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">과목별 학습 시간</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {Object.entries(subjectDurations)
                  .sort(([, a], [, b]) => b - a)
                  .map(([subject, minutes]) => (
                    <div key={subject} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{subject}</span>
                        <span className="text-muted-foreground">
                          {formatDuration(minutes)} ({Math.round((minutes / totalMinutes) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${(minutes / totalMinutes) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* 원형 타임라인 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">24시간 타임라인</h2>
          <Button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2"
            size="sm"
            disabled={isAddingNew}
          >
            <Plus className="h-4 w-4" />
            {isAddingNew ? "입력 중..." : "기록 추가"}
          </Button>
        </div>

        {/* 새 기록 추가 폼 (타임라인 위) */}
        {isAddingNew && (
          <Card className="border-blue-500 border-2">
            <CardContent className="pt-6">
              <StudyLogInlineForm
                date={dateStr}
                onSave={(data) => {
                  addLog({ ...data, date: dateStr });
                  setIsAddingNew(false);
                }}
                onCancel={() => setIsAddingNew(false)}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6 flex justify-center">
            {todayLogs.length === 0 && !isAddingNew ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">학습 기록이 없습니다</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  시간 블록을 추가하여 하루 일정을 시각화하세요
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsAddingNew(true)}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    첫 기록 추가하기
                  </Button>
                  <Button
                    onClick={() => {
                      // 샘플 데이터 추가
                      addLog({ date: dateStr, startTime: "09:00", endTime: "11:00", subject: "수학" });
                      addLog({ date: dateStr, startTime: "13:00", endTime: "15:30", subject: "영어" });
                      addLog({ date: dateStr, startTime: "16:00", endTime: "18:00", subject: "프로그래밍" });
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    샘플 데이터로 테스트
                  </Button>
                </div>
              </div>
            ) : (
              <CircularTimeline
                logs={todayLogs}
                onLogClick={(log) => setEditingId(log.id)}
                onTimeBlockCreate={(start, end) => {
                  // 새 블록 생성 로직 (향후 구현)
                }}
                onLogUpdate={(logId, startTime, endTime) => {
                  updateLog(logId, { startTime, endTime });
                }}
              />
            )}
          </CardContent>
        </Card>
      </section>

      {/* 기록 목록 (편집용) */}
      {todayLogs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">상세 목록</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddingNew(true)}
                className="flex items-center gap-2"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                기록 추가
              </Button>
              <Button
                onClick={() => {
                  if (confirm("오늘의 모든 학습 기록을 삭제하시겠습니까?")) {
                    todayLogs.forEach(log => deleteLog(log.id));
                  }
                }}
                variant="outline"
                size="sm"
              >
                전체 삭제
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {/* 기존 기록 목록 */}
                {todayLogs.map((log) => (
                  editingId === log.id ? (
                    <StudyLogInlineForm
                      key={log.id}
                      date={dateStr}
                      initialData={log}
                      onSave={(data) => {
                        updateLog(log.id, data);
                        setEditingId(null);
                      }}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/30 transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-[140px] text-sm">
                        <span className="font-medium">{log.startTime}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{log.endTime}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{log.subject}</h3>
                          <Badge variant="outline" className="text-xs">
                            {formatDuration(log.duration)}
                          </Badge>
                        </div>
                        {log.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{log.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditingId(log.id)}
                          className="p-1.5 rounded-md hover:bg-accent"
                          aria-label="수정"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("이 학습 기록을 삭제하시겠습니까?")) {
                              deleteLog(log.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-accent text-red-600"
                          aria-label="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </CardDetailLayout>
  );
}

function StudyLogInlineForm({
  date,
  initialData,
  onSave,
  onCancel,
}: {
  date: string;
  initialData?: StudyLogEntry;
  onSave: (data: { startTime: string; endTime: string; subject: string; description?: string }) => void;
  onCancel: () => void;
}) {
  const [startTime, setStartTime] = React.useState(initialData?.startTime || "09:00");
  const [endTime, setEndTime] = React.useState(initialData?.endTime || "10:00");
  const [subject, setSubject] = React.useState(initialData?.subject || "");
  const [description, setDescription] = React.useState(initialData?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      alert("과목/주제를 입력해주세요");
      return;
    }
    onSave({ startTime, endTime, subject: subject.trim(), description: description.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-lg border-2 border-primary bg-accent/20 space-y-3">
      <div className="grid grid-cols-[140px_1fr] gap-3">
        {/* 시간 입력 */}
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-16 px-2 py-1 text-sm rounded border bg-background"
            required
          />
          <span className="text-muted-foreground text-sm">→</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-16 px-2 py-1 text-sm rounded border bg-background"
            required
          />
        </div>

        {/* 과목 입력 */}
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="과목/주제 (예: 수학, 영어)"
          className="px-3 py-1.5 text-sm rounded border bg-background"
          required
          autoFocus
        />
      </div>

      {/* 메모 입력 */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="메모 (선택사항)"
        className="w-full px-3 py-2 text-sm rounded border bg-background resize-none"
        rows={2}
      />

      {/* 버튼 */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm rounded-md border hover:bg-accent flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          취소
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1"
        >
          <Check className="h-3 w-3" />
          {initialData ? "수정" : "추가"}
        </button>
      </div>
    </form>
  );
}
