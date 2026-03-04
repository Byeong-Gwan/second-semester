"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLearningStore } from "@/lib/store/learnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, CheckCircle2, Circle, Plus, Target, Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const learningStore = useLearningStore();
  const { learnings, getDailyChecklist, toggleDailyChecklistItem, calculateProgress } = learningStore;
  
  // Type assertions for checklist functions
  const addChecklistItem = (learningStore as any).addChecklistItem;
  const updateChecklistItem = (learningStore as any).updateChecklistItem;
  const removeChecklistItem = (learningStore as any).removeChecklistItem;
  
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [mounted, setMounted] = React.useState(false);
  const [checklistInput, setChecklistInput] = React.useState("");
  const [editingItemId, setEditingItemId] = React.useState<string | null>(null);

  React.useEffect(() => { setMounted(true); }, []);

  const project = learnings.find(l => l.id === projectId);
  
  if (!mounted) return <div className="animate-pulse h-40 bg-muted rounded-xl" />;
  if (!project) {
    return (
      <div className="container max-w-3xl py-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">프로젝트를 찾을 수 없습니다</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  const todayStr = format(selectedDate, "yyyy-MM-dd");
  const dailyChecklist = getDailyChecklist(project.id, todayStr);
  const dailyProgress = project.progressMode === "checklist" 
    ? Math.round((dailyChecklist?.checkedItems.length || 0) / (project.checklist?.length || 1) * 100)
    : calculateProgress(project.id);

  const isItemCheckedToday = (itemId: string) => {
    return dailyChecklist?.checkedItems.includes(itemId) || false;
  };

  const handleToggleItem = (itemId: string) => {
    toggleDailyChecklistItem(project.id, todayStr, itemId);
  };

  const handleAddChecklistItem = () => {
    if (checklistInput.trim() && project && (!project.checklist || project.checklist.length < 10)) {
      addChecklistItem(project.id, checklistInput.trim());
      setChecklistInput("");
    }
  };

  const handleUpdateChecklistItem = (itemId: string, title: string) => {
    if (project) {
      updateChecklistItem(project.id, itemId, title);
    }
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    if (project && project.checklist && project.checklist.length > 0) {
      if (confirm("이 체크리스트 항목을 삭제하시겠습니까?")) {
        removeChecklistItem(project.id, itemId);
      }
    } else {
      alert("체크리스트 항목이 없습니다.");
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "project": return "프로젝트";
      case "study": return "스터디";
      case "course": return "코스/강의";
      case "other": return "기타";
      default: return type;
    }
  };

  const getProgressModeLabel = (mode: string) => {
    switch (mode) {
      case "manual": return "직접 입력";
      case "checklist": return "체크리스트 자동 계산";
      case "days": return "기간별 자동 계산";
      default: return mode;
    }
  };

  return (
    <div className="container max-w-3xl py-6 px-4 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-accent min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{getTypeLabel(project.type)}</Badge>
            <Badge variant="secondary">{getProgressModeLabel(project.progressMode)}</Badge>
            {project.joined && <Badge variant="default">참여 중</Badge>}
          </div>
        </div>
      </div>

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            프로젝트 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">생성일</p>
              <p className="font-medium">{format(new Date(project.createdAt), "yyyy년 MM월 dd일", { locale: ko })}</p>
            </div>
            {project.startDate && (
              <div>
                <p className="text-sm text-muted-foreground">시작일</p>
                <p className="font-medium">{format(new Date(project.startDate), "yyyy년 MM월 dd일", { locale: ko })}</p>
              </div>
            )}
            {project.endDate && (
              <div>
                <p className="text-sm text-muted-foreground">종료일</p>
                <p className="font-medium">{format(new Date(project.endDate), "yyyy년 MM월 dd일", { locale: ko })}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">전체 진행률</p>
              <p className="font-medium">{calculateProgress(project.id).toFixed(2)}%</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>진행률</span>
              <span>{calculateProgress(project.id).toFixed(2)}%</span>
            </div>
            <Progress value={calculateProgress(project.id)} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* 체크리스트 모드일 경우 일간 체크리스트 표시 */}
      {project.progressMode === "checklist" && project.checklist && project.checklist.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                오늘의 체크리스트
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <input
                  type="date"
                  value={todayStr}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="px-2 py-1 text-sm border rounded"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                📝 체크 방법 안내
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                아래 항목들을 클릭하여 오늘 완료한 작업을 체크하세요. 체크한 항목은 진행률에 반영됩니다.
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>오늘의 진행률</span>
              <span>{dailyProgress.toFixed(2)}% ({dailyChecklist?.checkedItems.length || 0}/{project.checklist.length})</span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
            
            <div className="space-y-2">
              {project.checklist
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-4 rounded-lg border-2 hover:bg-accent/50 cursor-pointer transition-all hover:border-primary/30"
                    onClick={() => handleToggleItem(item.id)}
                  >
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // 이벤트 버블링 방지
                          handleToggleItem(item.id);
                        }}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          isItemCheckedToday(item.id) 
                            ? "bg-primary border-primary" 
                            : "border-gray-300 bg-white hover:border-primary"
                        }`}
                        aria-label={isItemCheckedToday(item.id) ? "체크 해제" : "체크"}
                      >
                        {isItemCheckedToday(item.id) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${isItemCheckedToday(item.id) ? "line-through text-muted-foreground" : ""}`}>
                        {item.title}
                      </span>
                      {isItemCheckedToday(item.id) && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          ✓ 오늘 완료됨
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="pt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
              💡 <strong>팁:</strong> 항목을 클릭하여 체크/체크 해제할 수 있습니다. 날짜를 변경하면 과거/미래의 체크리스트도 관리할 수 있습니다.
            </div>
          </CardContent>
        </Card>
      )}

      {/* 체크리스트 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            체크리스트 관리 ({project.checklist?.length || 0}개)
            <span className="text-sm text-muted-foreground">
              최소 3개, 최대 10개
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.checklist && project.checklist.length > 0 && (
            <div className="space-y-2">
              {project.checklist
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2 p-3 rounded-lg border">
                    <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                    {editingItemId === item.id ? (
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateChecklistItem(item.id, e.target.value)}
                        onBlur={() => setEditingItemId(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingItemId(null);
                          } else if (e.key === "Escape") {
                            setEditingItemId(null);
                          }
                        }}
                        className="flex-1 px-2 py-1 text-sm border rounded"
                        autoFocus
                      />
                    ) : (
                      <span 
                        className="flex-1 text-sm cursor-pointer hover:text-primary"
                        onClick={() => setEditingItemId(item.id)}
                      >
                        {item.title}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItemId(item.id)}
                        className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
                        aria-label="수정"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          handleRemoveChecklistItem(item.id);
                        }}
                        className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-600"
                        aria-label="삭제"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
          
          {(!project.checklist || project.checklist.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Plus className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm font-medium mb-2">체크리스트가 없습니다</p>
              <p className="text-xs mb-4">프로젝트를 위한 체크리스트 항목을 추가해보세요.</p>
            </div>
          )}
          
          {/* 새 항목 추가 */}
          {(!project.checklist || project.checklist.length < 10) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (checklistInput.trim()) {
                      handleAddChecklistItem();
                    }
                  }}
                  className="w-10 h-10 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors"
                  aria-label="체크리스트 항목 추가"
                >
                  <Plus className="h-5 w-5 text-primary" />
                </button>
                <input
                  type="text"
                  value={checklistInput}
                  onChange={(e) => setChecklistInput(e.target.value)}
                  placeholder={`체크리스트 항목 ${(project.checklist?.length || 0) + 1} 추가하기...`}
                  className="flex-1 px-3 py-2 text-sm border rounded-lg"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddChecklistItem();
                    }
                  }}
                />
                <button
                  onClick={handleAddChecklistItem}
                  className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  추가
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {project.checklist?.length || 0}/10개 항목 추가됨
              </p>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            • 항목을 클릭하거나 연필 아이콘으로 수정할 수 있습니다.<br/>
            • 수정 시 Enter로 저장, ESC로 취소할 수 있습니다.<br/>
            • 모든 항목을 삭제할 수 있습니다.<br/>
            • 최대 10개까지 추가할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
