"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogIn, LogOut } from "lucide-react";
import React from "react";

const PAGE_TITLES: Record<string, string> = {
  "/": "오늘",
  "/activity": "활동",
  "/daily": "일상",
  "/news": "뉴스",
  "/settings": "설정",
  "/login": "로그인",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/activity")) return "활동";
  if (pathname.startsWith("/daily")) return "일상";
  return "Second Semester";
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">2S</span>
          </div>
          <span className="font-bold text-lg">{title}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="h-8 w-8 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors"
              >
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 z-50 w-56 rounded-xl border bg-background shadow-lg p-2 space-y-1">
                    <div className="px-3 py-2 border-b mb-1">
                      <p className="text-sm font-semibold truncate">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                    </div>
                    <button
                      onClick={() => { signOut(); setShowMenu(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      로그아웃
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
