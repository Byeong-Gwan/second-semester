"use client";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useLearningStore } from "@/lib/store/learnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, TrendingUp, Edit2, Save, X } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function LearningDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { learnings, updateProgress, toggleJoined, removeLearning } = useLearningStore();
  const learning = learnings.find((l) => l.id === id);

  const [isEditing, setIsEditing] = React.useState(false);
  const [progress, setProgress] = React.useState(learning?.progress || 0);

  React.useEffect(() => {
    if (learning) {
      setProgress(learning.progress);
    }
  }, [learning]);

  if (!learning) {
    return (
      <main className="container max-w-4xl space-y-6 py-8">
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">학습을 찾을 수 없습니다</p>
              <button
                onClick={() => router.push("/mypage")}
                className="text-sm text-primary hover:underline"
              >
                목록으로 돌아가기
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  const handleSave = () => {
    updateProgress(id, progress);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("이 학습을 삭제하시겠습니까?")) {
      removeLearning(id);
      router.push("/mypage");
    }
  };

  return (
    <main className="container max-w-4xl space-y-6 py-8">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/mypage")}
          className="rounded-md border p-2 hover:bg-accent"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{learning.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">학습 상세 정보 및 관리</p>
        </div>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground mb-1">생성일</div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{format(new Date(learning.createdAt), "yyyy년 M월 d일 (EEE) HH:mm", { locale: ko })}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">상태</div>
              <Badge variant={learning.joined ? "default" : "outline"} className="text-sm">
                {learning.joined ? "참여 중" : "대기"}
              </Badge>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground mb-1">시작일</div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  {learning.startDate
                    ? format(new Date(learning.startDate), "yyyy년 M월 d일 (EEE)", { locale: ko })
                    : "미설정"}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">종료일</div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  {learning.endDate
                    ? format(new Date(learning.endDate), "yyyy년 M월 d일 (EEE)", { locale: ko })
                    : "미설정"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 진척도 관리 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>진척도</CardTitle>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
              >
                <Edit2 size={14} />
                수정
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  <Save size={14} />
                  저장
                </button>
                <button
                  onClick={() => {
                    setProgress(learning.progress);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  <X size={14} />
                  취소
                </button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">현재 진척도</span>
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
            <div className="h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium">진척도 조정</label>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 참여 관리 */}
      <Card>
        <CardHeader>
          <CardTitle>참여 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">참여 상태</div>
              <div className="text-sm text-muted-foreground">
                {learning.joined ? "현재 이 학습에 참여하고 있습니다" : "현재 참여하지 않고 있습니다"}
              </div>
            </div>
            <button
              onClick={() => toggleJoined(id)}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                learning.joined
                  ? "border hover:bg-accent"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {learning.joined ? "참여 해제" : "참여하기"}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">진행 기간</div>
              <div className="text-xl font-bold">
                {Math.floor((Date.now() - new Date(learning.createdAt).getTime()) / (1000 * 60 * 60 * 24))}일
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">진척도</div>
              <div className="text-xl font-bold">{learning.progress}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">남은 진척도</div>
              <div className="text-xl font-bold">{100 - learning.progress}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 위험 영역 */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">위험 영역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">학습 삭제</div>
              <div className="text-sm text-muted-foreground">이 작업은 되돌릴 수 없습니다</div>
            </div>
            <button
              onClick={handleDelete}
              className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
