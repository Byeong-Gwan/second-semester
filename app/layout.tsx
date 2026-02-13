import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { generateMetadata as genMeta, generateStructuredData } from "@/lib/utils/seo";

export const metadata: Metadata = genMeta({
  title: "Second Semester",
  description: "학습, 일정, 할 일, 출석을 한눈에 관리하는 스마트 학습 플래너. 체계적인 학습 관리와 생산성 향상을 위한 올인원 솔루션",
  keywords: ["학습 플래너", "할 일 관리", "출석 체크", "스터디 플래너", "일정 관리", "생산성"],
  path: "/",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = generateStructuredData("WebApplication");
  
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Providers>
          <div className="min-h-dvh flex flex-col">
            <AppHeader />
            <main className="flex-1 pb-20">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
