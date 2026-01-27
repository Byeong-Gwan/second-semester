// 이 파일은 상세 화면의 '큰 틀'을 만드는 곳이에요.
// 쉽게 말해, 위에는 제목이 나오고 아래에는 내용이 차곡차곡 들어가요.
import React from "react";
import { DetailHeader } from "./DetailHeader";

export function CardDetailLayout({
  title,
  description,
  actions,
  backHref = "/",
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    // 화면의 바깥 여백과 간격을 정리해주는 큰 상자예요.
    <div className="container py-8 space-y-6">
      {/* 위쪽에 제목과 설명, 뒤로가기 버튼을 보여줘요. */}
      <DetailHeader title={title} description={description} backHref={backHref} actions={actions} />
      {/* 아래에는 우리가 넣고 싶은 내용들이 순서대로 들어가요. */}
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-12 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
