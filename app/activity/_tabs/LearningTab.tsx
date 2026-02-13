"use client";

import React from "react";
import { useLearningStore, type Learning } from "@/lib/store/learnings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function LearningTab() {
  const { learnings, addLearning, removeLearning, updateLearning } = useLearningStore();
  const [showModal, setShowModal] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Learning | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="animate-pulse h-40 bg-muted rounded-xl" />;

  const handleEdit = (learning: Learning) => {
    setEditTarget(learning);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("이 학습을 삭제하시겠습니까?")) {
      removeLearning(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* 추가 버튼 */}
      <button
        onClick={() => { setEditTarget(null); setShowModal(true); }}
        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 text-primary font-medium hover:bg-primary/10 transition-colors min-h-[52px] active:scale-[0.98]"
      >
        <Plus className="h-5 w-5" />
        학습 추가
      </button>

      {/* 학습 목록 */}
      {learnings.length === 0 ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">아직 학습이 없습니다. 위 버튼을 눌러 추가하세요.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {learnings.map((learning) => (
            <Card key={learning.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{learning.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={learning.joined ? "default" : "outline"} className="text-xs">
                        {learning.joined ? "참여 중" : "대기"}
                      </Badge>
                      {learning.startDate && (
                        <span className="text-xs text-muted-foreground">
                          {learning.startDate} ~ {learning.endDate || ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(learning)}
                      className="p-2.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="수정"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(learning.id)}
                      className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">진행률</span>
                    <span className="font-semibold">{learning.progress}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        learning.progress >= 80 ? "bg-green-500" :
                        learning.progress >= 50 ? "bg-blue-500" :
                        learning.progress >= 30 ? "bg-yellow-500" :
                        "bg-gray-400"
                      }`}
                      style={{ width: `${learning.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 모달 */}
      {showModal && (
        <LearningModal
          learning={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSave={(data) => {
            if (editTarget) {
              updateLearning(editTarget.id, data);
            } else {
              addLearning(data.title!, data.startDate, data.endDate);
            }
            setShowModal(false);
            setEditTarget(null);
          }}
        />
      )}
    </div>
  );
}

function LearningModal({
  learning,
  onClose,
  onSave,
}: {
  learning: Learning | null;
  onClose: () => void;
  onSave: (data: Partial<Learning>) => void;
}) {
  const [formData, setFormData] = React.useState({
    title: learning?.title || "",
    startDate: learning?.startDate || "",
    endDate: learning?.endDate || "",
    progress: learning?.progress || 0,
    joined: learning?.joined ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl border bg-background p-6 shadow-xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{learning ? "학습 수정" : "학습 추가"}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
              placeholder="예: 알고리즘 스터디"
              required
              autoFocus
            />
          </div>

          {learning && (
            <div>
              <label className="text-sm font-medium">진행률 ({formData.progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                className="mt-1.5 w-full h-2 accent-primary"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">시작일</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
              />
            </div>
            <div>
              <label className="text-sm font-medium">종료일</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
                min={formData.startDate || undefined}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all min-h-[52px]"
            >
              {learning ? "저장" : "추가"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border-2 px-4 py-3.5 text-base font-semibold hover:bg-accent active:scale-[0.98] transition-all min-h-[52px]"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
