// 이 파일은 상세 화면 맨 위에 보이는 '제목 영역'이에요.
// 뒤로 가기 버튼과 큰 제목, 그리고 오른쪽에 버튼(액션)을 놓을 수 있어요.
import React from "react";
import Link from "next/link";

export function DetailHeader({
  title,
  description,
  backHref = "/",
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  actions?: React.ReactNode;
}) {
  return (
    // 위쪽에 간격을 살짝 주고, 제목과 설명을 보여주는 상자예요.
    <header className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 이 글씨를 누르면 대시보드로 다시 돌아가요. */}
          <Link href={backHref} className="text-sm text-muted-foreground hover:underline">
            ← 대시보드로 돌아가기
          </Link>
        </div>
        {/* 오른쪽에는 필요한 버튼들을 줄줄이 놓을 수 있어요. */}
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div>
        {/* 크고 두꺼운 글씨로 제목을 보여줘요. */}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description ? (
          // 제목 아래에 조그맣게 설명을 붙여요.
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
