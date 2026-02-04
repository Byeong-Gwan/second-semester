"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useLearningStore } from "@/lib/store/learnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function LearningsPage() {
  const router = useRouter();
  const { learnings, addLearning, removeLearning } = useLearningStore();
  const [showModal, setShowModal] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addLearning(title.trim());
    setTitle("");
    setShowModal(false);
  };

  return (
    <main className="container max-w-6xl space-y-6 py-8">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">학습 관리</h1>
          <p className="text-muted-foreground mt-1">내 학습 목록과 진행 상황을 확인하세요</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={15} />
          학습 추가
        </button>
      </div>

      {/* 통계 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">전체 학습</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learnings.length}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">참여 중</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learnings.filter((l) => l.joined).length}개</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">평균 진척도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {learnings.length > 0
                ? Math.round(learnings.reduce((sum, l) => sum + l.progress, 0) / learnings.length)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 학습 목록 */}
      {learnings.length === 0 ? (
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">아직 학습이 없습니다</p>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-primary hover:underline"
              >
                첫 학습 만들기
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {learnings.map((learning) => (
            <Card
              key={learning.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors group"
              onClick={() => router.push(`/mypage/learning/${learning.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{learning.title}</CardTitle>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("이 학습을 삭제하시겠습니까?")) {
                        removeLearning(learning.id);
                      }
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 상태 배지 */}
                <div className="flex gap-2">
                  <Badge variant={learning.joined ? "default" : "outline"}>
                    {learning.joined ? "참여 중" : "대기"}
                  </Badge>
                </div>

                {/* 진척도 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">진척도</span>
                    <span className="font-medium">{learning.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${learning.progress}%` }}
                    />
                  </div>
                </div>

                {/* 기간 */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {learning.startDate && learning.endDate ? (
                    <span>
                      {format(new Date(learning.startDate), "M/d")} ~ {format(new Date(learning.endDate), "M/d")}
                    </span>
                  ) : learning.startDate ? (
                    <span>{format(new Date(learning.startDate), "yyyy년 M월 d일")} ~</span>
                  ) : (
                    <span>기간 미설정</span>
                  )}
                </div>

                {/* 클릭 안내 */}
                <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <TrendingUp size={12} />
                  클릭하여 상세 보기
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 생성 모달 */}
      {showModal && <LearningModal onClose={() => setShowModal(false)} />}
    </main>
  );
}

function LearningModal({ onClose }: { onClose: () => void }) {
  const { addLearning } = useLearningStore();
  const [formData, setFormData] = React.useState({
    title: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addLearning(formData.title, formData.startDate || undefined, formData.endDate || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold">새 학습 만들기</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              placeholder="예: 알고리즘 스터디"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium">시작일 (선택)</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium">종료일 (선택)</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
              min={formData.startDate || undefined}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              만들기
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}