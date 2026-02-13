"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const PAGE_TITLES: Record<string, string> = {
  "/": "오늘",
  "/activity": "활동",
  "/activity/learning": "학습 관리",
  "/activity/todos": "할 일",
  "/activity/attendance": "출석",
  "/activity/reflection": "회고",
  "/activity/study-log": "학습 일지",
  "/settings": "설정",
  "/daily": "일상",
  "/dashboard": "대시보드",
  "/mypage": "내 학습",
  "/mypage/todos": "할 일",
  "/mypage/attendance": "출석",
  "/mypage/reflection": "회고",
  "/mypage/study-log": "학습 일지",
  "/mypage/report": "성과 리포트",
  "/mypage/timeline": "타임라인",
  "/mypage/settings": "설정",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // /mypage/learning/[id] 같은 동적 경로
  if (pathname.startsWith("/mypage/learning/")) return "학습 상세";
  if (pathname.startsWith("/activity")) return "활동";
  if (pathname.startsWith("/mypage")) return "내 학습";
  return "Second Semester";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">2S</span>
          </div>
          <span className="font-bold text-lg">{title}</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
