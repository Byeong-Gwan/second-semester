"use client";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, LayoutGrid, Clock, BookOpen, Calendar, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Header() {
  const pathname = usePathname();
  const today = new Date();
  const semester = {
    name: "2026 Q1 세컨드 학기",
    start: new Date(today.getFullYear(), 0, 2),
    end: new Date(today.getFullYear(), 2, 31),
    progress: 42,
  };

  const navItems = [
    { href: "/", icon: Home, label: "홈" },
    { href: "/dashboard", icon: LayoutGrid, label: "대시보드" },
    { href: "/mypage/study-log", icon: Clock, label: "학습 일지" },
    { href: "/mypage/reflection", icon: BookOpen, label: "회고" },
    { href: "/mypage/timeline", icon: Calendar, label: "타임라인" },
    { href: "/mypage", icon: User, label: "MY" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-sm sm:text-base">2S</span>
        </Link>
        
        {/* 네비게이션 메뉴 */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-md hover:bg-accent transition-colors ${
                  isActive ? "bg-accent" : ""
                }`}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
