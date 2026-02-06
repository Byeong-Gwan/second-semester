"use client";

import { CardDetailLayout } from "@/components/detail/CardDetailLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Upload } from "lucide-react";
import React from "react";
import { downloadBackup, uploadBackup } from "@/lib/utils/backup";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
  const { addToast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    try {
      downloadBackup();
      addToast({
        title: "백업 완료",
        description: "백업 파일이 다운로드되었습니다.",
        variant: "success",
      });
    } catch (error) {
      addToast({
        title: "백업 실패",
        description: "백업 다운로드 중 오류가 발생했습니다.",
        variant: "error",
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await uploadBackup(file);
    
    if (result.success) {
      addToast({
        title: "복구 완료",
        description: "데이터가 성공적으로 복구되었습니다. 페이지를 새로고침합니다.",
        variant: "success",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      addToast({
        title: "복구 실패",
        description: result.error || "데이터 복구 중 오류가 발생했습니다.",
        variant: "error",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <CardDetailLayout
      title="설정"
      description="데이터 백업 및 복구를 관리합니다."
    >
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">데이터 관리</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* 백업 다운로드 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download size={20} />
                데이터 백업
              </CardTitle>
              <CardDescription>
                현재 데이터를 JSON 파일로 내보냅니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={handleDownload}
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                백업 파일 다운로드
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                학습, 할 일, 출석 데이터가 모두 포함됩니다.
              </p>
            </CardContent>
          </Card>

          {/* 백업 복구 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload size={20} />
                데이터 복구
              </CardTitle>
              <CardDescription>
                백업 파일에서 데이터를 가져옵니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleUpload}
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
              >
                백업 파일 선택
              </button>
              <p className="mt-3 text-xs text-muted-foreground">
                ⚠️ 현재 데이터가 백업 파일로 대체됩니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">백업 안내</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-medium mb-1">💾 정기적인 백업을 권장합니다</h3>
                <p className="text-muted-foreground">
                  브라우저 캐시 삭제 시 데이터가 손실될 수 있습니다. 주기적으로 백업 파일을 다운로드하세요.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">📁 백업 파일 형식</h3>
                <p className="text-muted-foreground">
                  파일명: second-semester-backup-YYYY-MM-DD.json
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">🔄 복구 방법</h3>
                <p className="text-muted-foreground">
                  1. "백업 파일 선택" 버튼 클릭<br />
                  2. 백업 파일(.json) 선택<br />
                  3. 자동으로 데이터 복구 및 페이지 새로고침
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-1">⚠️ 주의사항</h3>
                <p className="text-muted-foreground">
                  데이터 복구 시 현재 데이터가 완전히 대체됩니다. 복구 전 현재 데이터를 백업하는 것을 권장합니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </CardDetailLayout>
  );
}
