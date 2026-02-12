"use client";

import React from "react";
import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReflectionStore, ReflectionCategory } from "@/lib/store/reflection";
import { useStudyLogStore } from "@/lib/store/studyLog";
import { ActivityHeatmap } from "@/components/reflection/ActivityHeatmap";
import { 
  BookOpen, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Save,
  Smile,
  Meh,
  Frown,
  ThumbsUp,
  GraduationCap,
  User,
  Briefcase,
  Heart,
  Tag
} from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import { ko } from "date-fns/locale";

const MOOD_ICONS = {
  great: { icon: ThumbsUp, label: "최고!", color: "text-green-600" },
  good: { icon: Smile, label: "좋음", color: "text-blue-600" },
  okay: { icon: Meh, label: "보통", color: "text-yellow-600" },
  bad: { icon: Frown, label: "안좋음", color: "text-red-600" },
};

const CATEGORIES = {
  study: { icon: GraduationCap, label: "학습", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  personal: { icon: User, label: "개인", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  project: { icon: Briefcase, label: "프로젝트", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  health: { icon: Heart, label: "건강", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  other: { icon: Tag, label: "기타", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
};

export default function ReflectionPage() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState<ReflectionCategory>("study");
  const [mood, setMood] = React.useState<"great" | "good" | "okay" | "bad" | undefined>();
  const [mounted, setMounted] = React.useState(false);

  const { 
    addReflection, 
    updateReflection, 
    deleteReflection,
    getReflectionByDate,
    getAllReflections
  } = useReflectionStore();
  
  const { 
    getLogsByDate, 
    getTotalDurationByDate,
    getSubjectDurationByDate 
  } = useStudyLogStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const existingReflection = mounted ? getReflectionByDate(dateStr) : undefined;
  const todayLogs = mounted ? getLogsByDate(dateStr) : [];
  const totalMinutes = mounted ? getTotalDurationByDate(dateStr) : 0;
  const subjectDurations = mounted ? getSubjectDurationByDate(dateStr) : {};

  // 기존 회고 불러오기 (날짜 변경 시에만)
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
  }, [dateStr]); // existingReflection 제거하여 저장 후 재로드 방지

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

  const handleSave = () => {
    if (!content.trim()) {
      alert("회고 내용을 입력해주세요.");
      return;
    }

    if (existingReflection) {
      updateReflection(existingReflection.id, { content, category, mood });
    } else {
      addReflection({ date: dateStr, content, category, mood });
    }

    alert("회고가 저장되었습니다!");
    
    // 저장 후 입력 필드 초기화
    setContent("");
    setCategory("study");
    setMood(undefined);
  };

  const handleEdit = () => {
    if (!existingReflection) return;
    
    // 회고 데이터를 입력 필드에 로드
    setContent(existingReflection.content);
    setCategory(existingReflection.category);
    setMood(existingReflection.mood);
    
    // 입력 필드로 스크롤
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
      alert("회고가 삭제되었습니다.");
    }
  };

  return (
    <CardDetailLayout 
      title="학습 회고" 
      description="하루 학습을 돌아보고 회고를 작성하세요"
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

      {/* 회고 통계 */}
      {mounted && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">회고 통계</h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-teal-600" />
                  총 회고
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                  {getAllReflections().length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">전체 작성한 회고</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  이번 달
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {getAllReflections().filter(r => {
                    const reflectionDate = new Date(r.date);
                    const now = new Date();
                    return reflectionDate.getMonth() === now.getMonth() && 
                           reflectionDate.getFullYear() === now.getFullYear();
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">이번 달 작성</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  연속 작성
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {(() => {
                    const reflections = getAllReflections().sort((a, b) => 
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                    let streak = 0;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    for (let i = 0; i < reflections.length; i++) {
                      const checkDate = new Date(today);
                      checkDate.setDate(checkDate.getDate() - i);
                      const checkDateStr = format(checkDate, "yyyy-MM-dd");
                      
                      if (reflections.some(r => r.date === checkDateStr)) {
                        streak++;
                      } else {
                        break;
                      }
                    }
                    return streak;
                  })()}일
                </div>
                <p className="text-xs text-muted-foreground mt-1">연속 작성 일수</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* 회고 활동 히트맵 */}
      {mounted && (
        <section>
          <Card>
            <CardContent className="pt-6">
              <ActivityHeatmap reflections={getAllReflections()} monthsToShow={3} />
            </CardContent>
          </Card>
        </section>
      )}

      {/* 학습 요약 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">오늘의 학습 요약</h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                총 학습 시간
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
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
              <div className="flex flex-wrap gap-2">
                {Object.entries(subjectDurations).map(([subject, duration]) => (
                  <Badge key={subject} variant="outline">
                    {subject} ({formatDuration(duration)})
                  </Badge>
                ))}
                {Object.keys(subjectDurations).length === 0 && (
                  <p className="text-sm text-muted-foreground">학습 기록 없음</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 카테고리 선택 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">카테고리</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              {(Object.entries(CATEGORIES) as [ReflectionCategory, typeof CATEGORIES[ReflectionCategory]][]).map(([key, { icon: Icon, label, color }]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    category === key 
                      ? `${color} border-current` 
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 기분 선택 */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">오늘의 기분</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 justify-center">
              {(Object.entries(MOOD_ICONS) as [keyof typeof MOOD_ICONS, typeof MOOD_ICONS[keyof typeof MOOD_ICONS]][]).map(([key, { icon: Icon, label, color }]) => (
                <button
                  key={key}
                  onClick={() => setMood(key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                    mood === key 
                      ? "border-primary bg-primary/10" 
                      : "border-transparent hover:border-muted-foreground/20"
                  }`}
                >
                  <Icon className={`h-8 w-8 ${mood === key ? color : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 회고 작성 */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">회고 작성</h2>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            저장
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 하루를 돌아보며 회고를 작성해보세요...

예시:
- 오늘 배운 것
- 잘한 점
- 개선할 점
- 내일 할 일
- 느낀 점"
              className="w-full min-h-[300px] p-4 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-4 text-xs text-muted-foreground">
              마크다운 문법을 사용할 수 있습니다. (# 제목, - 목록, **굵게** 등)
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 저장된 회고 미리보기 */}
      {existingReflection && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">저장된 회고</h2>
            <div className="flex items-center gap-2">
              <Badge className={CATEGORIES[existingReflection.category].color}>
                {CATEGORIES[existingReflection.category].label}
              </Badge>
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                수정
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                삭제
              </Button>
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{existingReflection.content}</pre>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                마지막 수정: {format(new Date(existingReflection.updatedAt), "yyyy-MM-dd HH:mm")}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </CardDetailLayout>
  );
}
