"use client";

import React from "react";
import Link from "next/link";
import { useLearningStore, type Learning } from "@/lib/store/learnings";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { useGlobalPopupState } from "@/lib/hooks/usePopupState";

export default function LearningTab() {
  const store = useLearningStore();
  const { 
    learnings, 
    addLearning, 
    removeLearning, 
    updateLearning
  } = store;
  
  // Type assertions for checklist functions
  const addChecklistItem = (store as any).addChecklistItem;
  const removeChecklistItem = (store as any).removeChecklistItem;
  const updateChecklistItem = (store as any).updateChecklistItem;
  
  const [showModal, setShowModal] = React.useState(false);
  const [editTarget, setEditTarget] = React.useState<Learning | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const { openPopup, closePopup } = useGlobalPopupState();
  const closePopupFn = closePopup as any;

  React.useEffect(() => { setMounted(true); }, []);
  
  React.useEffect(() => {
    if (showModal) {
      openPopup('drawer');
    } else {
      closePopupFn();
    }
  }, [showModal]);
  
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
        프로젝트 추가
      </button>

      {/* 학습 목록 */}
      {learnings.length === 0 ? (
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-sm text-muted-foreground">아직 프로젝트가 없습니다. 위 버튼을 눌러 추가하세요.</p>
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
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant={learning.joined ? "default" : "outline"} className="text-xs shrink-0">
                        <span className="hidden sm:inline">{learning.joined ? "참여 중" : "대기"}</span>
                        <span className="sm:hidden">{learning.joined ? "참여" : "대기"}</span>
                      </Badge>
                      {learning.startDate && (
                        <span className="text-xs text-muted-foreground truncate min-w-0">
                          <span className="hidden sm:inline">{learning.startDate} ~ {learning.endDate || ""}</span>
                          <span className="sm:hidden">{learning.startDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link
                      href={`/activity/project/${learning.id}`}
                      className="p-2.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="상세 보기"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
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
              addLearning(data.title!, data.startDate, data.endDate, data.progressMode);
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
    type: learning?.type || "project",
    progressMode: learning?.progressMode || "manual",
  });
  const [checklistInput, setChecklistInput] = React.useState("");

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
          <h2 className="text-xl font-bold">{learning ? "프로젝트 수정" : "프로젝트 추가"}</h2>
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
              placeholder="예: 알고리즘 스터디, 포트폴리오 프로젝트"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium">프로젝트 유형</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
            >
              <option value="project">프로젝트</option>
              <option value="study">스터디</option>
              <option value="course">코스/강의</option>
              <option value="other">기타</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">진행률 계산 방식</label>
            <select
              value={formData.progressMode}
              onChange={(e) => setFormData({ ...formData, progressMode: e.target.value as any })}
              className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
            >
              <option value="manual">직접 입력</option>
              <option value="checklist">체크리스트 자동 계산</option>
              <option value="days">기간별 자동 계산</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.progressMode === "manual" && "슬라이더로 직접 진행률을 조절합니다."}
              {formData.progressMode === "checklist" && "체크리스트 항목 완료율로 자동 계산됩니다."}
              {formData.progressMode === "days" && "시작일부터 종료일까지의 경과일로 자동 계산됩니다."}
            </p>
          </div>

          {learning && formData.progressMode === "manual" && (
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

          {learning?.progressMode === "checklist" && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">체크리스트 관리</h4>
                </div>
                <p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
                  체크리스트 항목은 프로젝트 상세 페이지에서 추가하고 관리할 수 있습니다.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (learning) {
                        // 최소 3개 기본 체크리스트 생성
                        const learningStore = useLearningStore.getState();
                        learningStore.addChecklistItem(learning.id, "항목 1: 기본 목표 설정");
                        learningStore.addChecklistItem(learning.id, "항목 2: 계획 수립");
                        learningStore.addChecklistItem(learning.id, "항목 3: 실행 및 관리");
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    기본 체크리스트 생성
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // 바로 상세 페이지로 이동
                      window.location.href = `/activity/project/${learning?.id}`;
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    상세 페이지에서 관리
                  </button>
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                  • 상세 페이지에서 체크리스트를 자유롭게 추가/수정/삭제할 수 있습니다<br/>
                  • 최소 3개, 최대 10개의 항목을 설정할 수 있습니다
                </p>
              </div>
            )}

          {learning && formData.progressMode === "days" && (
            <div>
              <label className="text-sm font-medium">기간별 진행률</label>
              <p className="text-sm text-muted-foreground mt-1">
                시작일과 종료일을 기준으로 경과일에 따라 자동 계산됩니다.
              </p>
              {formData.startDate && formData.endDate && (
                <p className="text-xs text-primary mt-1">
                  예상: {Math.round(((new Date().getTime() - new Date(formData.startDate).getTime()) / 
                    (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime())) * 100)}%
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">
                시작일
                {formData.progressMode === "days" && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
                required={formData.progressMode === "days"}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                종료일
                {formData.progressMode === "days" && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="mt-1.5 w-full rounded-xl border px-4 py-3 text-base"
                min={formData.startDate || undefined}
                required={formData.progressMode === "days"}
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
