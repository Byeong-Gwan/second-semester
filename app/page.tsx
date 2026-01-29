// 이 파일은 우리 집의 '메인 방'이에요. 화면에 보이는 내용을 그려줘요.
// 아주 쉬운 말로: 여기 있는 글과 상자들이 화면에 차례대로 나타나요.
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useLearningStore } from "@/lib/store/learnings";
import { format } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const learnings = useLearningStore((s) => s.learnings);
  const addLearning = useLearningStore((s) => s.addLearning);
  const removeLearning = useLearningStore((s) => s.removeLearning);
  const toggleJoined = useLearningStore((s) => s.toggleJoined);
  const updateProgress = useLearningStore((s) => s.updateProgress);

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    addLearning(t);
    setTitle("");
    setOpen(false);
    // 생성 후 메인에서 바로 목록으로 확인 가능. 필요하면 router.push("/mypage")
  };

  return (
    <main className="container space-y-6 py-8">
      {/* 히어로: 학습 생성 우선 */}
      <section className="rounded-xl border p-6 bg-card">
        <h1 className="text-2xl font-bold tracking-tight">오늘의 학습을 시작해요</h1>
        <p className="text-sm text-muted-foreground mt-1">
          학습을 만들고, 위에 있는 MY 버튼으로 나의 목록을 더 편하게 관리할 수 있어요.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
            onClick={() => setOpen(true)}
          >
            학습 만들기
          </button>
        </div>
      </section>

      {/* 간단 요약 */}
      <section className="rounded-lg border p-4">
        <div className="text-sm text-muted-foreground">내가 만든 학습</div>
        <div className="mt-1 text-lg font-semibold">{learnings.length}개</div>
      </section>

      {/* 생성된 학습 목록(간단) */}
      {learnings.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">최근 학습</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {learnings.map((l) => (
              <div key={l.id} className="rounded-lg border p-4 bg-card space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{l.title}</div>
                  <button
                    className="text-xs text-red-500 hover:underline"
                    onClick={() => removeLearning(l.id)}
                  >
                    삭제
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  생성일: {format(new Date(l.createdAt), "yyyy.MM.dd HH:mm")}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">진척도</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={l.progress}
                    onChange={(e) => updateProgress(l.id, Number(e.target.value))}
                  />
                  <span className="w-10 text-right">{l.progress}%</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    상태: {l.joined ? "참여 중" : "참여 안 함"}
                  </div>
                  <button
                    className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
                    onClick={() => toggleJoined(l.id)}
                  >
                    {l.joined ? "참여 해제" : "참여하기"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 생성 모달 */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border bg-background p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">새 학습 만들기</h2>
              <button
                className="text-sm text-muted-foreground hover:underline"
                onClick={() => setOpen(false)}
              >
                닫기
              </button>
            </div>
            <form onSubmit={onCreate} className="mt-4 space-y-3">
              <label className="block text-sm">
                제목
                <input
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  placeholder="예: 수학 복습 플랜"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
                >
                  만들기
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}