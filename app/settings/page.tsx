"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Moon, Sun, Download, Upload, Trash2, Info } from "lucide-react";

export default function SettingsPage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="container max-w-3xl py-6 px-4"><div className="animate-pulse h-40 bg-muted rounded-xl" /></div>;

  const handleExport = () => {
    const data: Record<string, string | null> = {};
    const keys = ["learnings-storage", "todos-storage", "attendance-storage", "reflections-storage", "study-log-storage", "timeline-storage"];
    keys.forEach((key) => {
      const val = localStorage.getItem(key);
      if (val) data[key] = val;
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `second-semester-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert("데이터가 내보내기 되었습니다!");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === "string") {
              localStorage.setItem(key, value);
            }
          });
          alert("데이터가 가져오기 되었습니다! 페이지를 새로고침합니다.");
          window.location.reload();
        } catch {
          alert("올바른 백업 파일이 아닙니다.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAll = () => {
    if (confirm("정말 모든 데이터를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      if (confirm("한 번 더 확인합니다. 모든 학습, 할 일, 출석, 회고 데이터가 삭제됩니다.")) {
        const keys = ["learnings-storage", "todos-storage", "attendance-storage", "reflections-storage", "study-log-storage", "timeline-storage"];
        keys.forEach((key) => localStorage.removeItem(key));
        alert("모든 데이터가 삭제되었습니다. 페이지를 새로고침합니다.");
        window.location.reload();
      }
    }
  };

  return (
    <div className="container max-w-3xl py-6 px-4 space-y-6">
      {/* 테마 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">화면</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Sun className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-semibold">테마</p>
                  <p className="text-xs text-muted-foreground">라이트 / 다크 모드 전환</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 데이터 관리 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">데이터 관리</h2>

        <Card>
          <CardContent className="p-4 space-y-1">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors min-h-[52px] text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">데이터 내보내기</p>
                <p className="text-xs text-muted-foreground">JSON 파일로 백업</p>
              </div>
            </button>

            <button
              onClick={handleImport}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors min-h-[52px] text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <Upload className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">데이터 가져오기</p>
                <p className="text-xs text-muted-foreground">백업 파일에서 복원</p>
              </div>
            </button>

            <button
              onClick={handleClearAll}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors min-h-[52px] text-left"
            >
              <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold text-red-600">모든 데이터 삭제</p>
                <p className="text-xs text-muted-foreground">되돌릴 수 없습니다</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </section>

      {/* 앱 정보 */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">정보</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">2S</span>
              </div>
              <div>
                <p className="font-semibold">Second Semester</p>
                <p className="text-xs text-muted-foreground">v2.0.0 · 학습 관리 플래너</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground space-y-1">
              <p>• 모든 데이터는 브라우저 로컬 저장소에 저장됩니다</p>
              <p>• 브라우저 데이터를 삭제하면 앱 데이터도 삭제됩니다</p>
              <p>• 정기적으로 데이터를 백업하는 것을 권장합니다</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
