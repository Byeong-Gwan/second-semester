"use client";

import React from "react";
import { useReflectionStore, type ReflectionCategory } from "@/lib/store/reflection";
import { useStudyLogStore } from "@/lib/store/studyLog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Save, Pencil, Trash2, GraduationCap, User, Briefcase, Heart, Tag, ThumbsUp, Smile, Meh, Frown } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ko } from "date-fns/locale";
import { ActivityHeatmap } from "@/components/reflection/ActivityHeatmap";

const CATEGORIES = {
  study: { icon: GraduationCap, label: "학습", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  personal: { icon: User, label: "개인", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  project: { icon: Briefcase, label: "프로젝트", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  health: { icon: Heart, label: "건강", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  other: { icon: Tag, label: "기타", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
};

const MOODS = {
  great: { icon: ThumbsUp, label: "최고!", color: "text-green-600" },
  good: { icon: Smile, label: "좋음", color: "text-blue-600" },
  okay: { icon: Meh, label: "보통", color: "text-yellow-600" },
  bad: { icon: Frown, label: "안좋음", color: "text-red-600" },
};

export default function ReflectionTab() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<ReflectionCategory>("study");
  const [mood, setMood] = React.useState<"great" | "good" | "okay" | "bad" | undefined>();
  const [mounted, setMounted] = React.useState(false);

  const { addReflection, updateReflection, deleteReflection, getReflectionByDate, getAllReflections } = useReflectionStore();
  const { getTotalDurationByDate } = useStudyLogStore();

  React.useEffect(() => { setMounted(true); }, []);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const existingReflection = mounted ? getReflectionByDate(dateStr) : undefined;
  const totalMinutes = mounted ? getTotalDurationByDate(dateStr) : 0;

  React.useEffect(() => {
    if (existingReflection) {
      setContent(existingReflection.content);
      setCategory(existingReflection.category);
      setMood(existingReflection.mood);
    } else {
      setContent("");
      setCategory("study");
      setMood(undefined);
    }
  }, [dateStr]);

  if (!mounted) return <div className="animate-pulse h-40 bg-muted rounded-xl" />;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}분`;
    if (mins === 0) return `${hours}시간`;
    return `${hours}시간 ${mins}분`;
  };

  const handleSave = () => {
    if (!content.trim()) { alert("회고 내용을 입력해주세요."); return; }
    if (existingReflection) {
      updateReflection(existingReflection.id, { content, category, mood });
    } else {
      addReflection({ date: dateStr, content, category, mood });
    }
    alert("회고가 저장되었습니다!");
    setContent("");
    setCategory("study");
    setMood(undefined);
  };

  const handleEdit = () => {
    if (!existingReflection) return;
    setContent(existingReflection.content);
    setCategory(existingReflection.category);
    setMood(existingReflection.mood);
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
      textarea.focus();
    }
  };

  const handleDelete = () => {
    if (!existingReflection) return;
    if (confirm("정말 이 회고를 삭제하시겠습니까?")) {
      deleteReflection(existingReflection.id);
      setContent("");
      setCategory("study");
      setMood(undefined);
    }
  };

  return (
    <div className="space-y-4">
      {/* 히트맵 */}
      <Card>
        <CardContent className="p-4">
          <ActivityHeatmap reflections={getAllReflections()} monthsToShow={3} />
        </CardContent>
      </Card>

      {/* 날짜 선택 */}
      <div className="flex items-center justify-between">
        <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2.5 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className="text-lg font-bold">{format(selectedDate, "M월 d일 (EEE)", { locale: ko })}</div>
          {totalMinutes > 0 && (
            <div className="text-xs text-muted-foreground">학습 {formatDuration(totalMinutes)}</div>
          )}
        </div>
        <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2.5 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* 카테고리 */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {(Object.entries(CATEGORIES) as [ReflectionCategory, typeof CATEGORIES[ReflectionCategory]][]).map(([key, { icon: Icon, label, color }]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
              category === key ? `${color} border-2 border-current` : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* 기분 */}
      <div className="grid grid-cols-4 gap-2">
        {(Object.entries(MOODS) as ["great" | "good" | "okay" | "bad", typeof MOODS["great"]][]).map(([key, { icon: Icon, label, color }]) => (
          <button
            key={key}
            onClick={() => setMood(mood === key ? undefined : key)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all min-h-[60px] ${
              mood === key ? `${color} border-current bg-accent` : "border-transparent bg-muted/60 hover:bg-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* 작성 */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 하루를 돌아보며 회고를 작성해보세요..."
            className="w-full min-h-[160px] p-3 rounded-xl border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base"
          />
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all min-h-[52px]"
          >
            <Save className="h-5 w-5" />
            저장
          </button>
        </CardContent>
      </Card>

      {/* 저장된 회고 */}
      {existingReflection && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">저장된 회고</h3>
              <div className="flex items-center gap-1">
                <Badge className={CATEGORIES[existingReflection.category].color}>
                  {CATEGORIES[existingReflection.category].label}
                </Badge>
                <button onClick={handleEdit} className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-blue-600 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">{existingReflection.content}</pre>
            <div className="text-xs text-muted-foreground">
              수정: {format(new Date(existingReflection.updatedAt), "M/d HH:mm")}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
