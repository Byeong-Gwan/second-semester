import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import Link from "next/link";
import { HeaderNavSwitch } from "@/components/HeaderNavSwitch";
import { Home, LayoutDashboard, Sun, User, Settings } from "lucide-react";
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
            {/* header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2S</span>
                  </div>
                  <span className="hidden sm:inline">Second Semester</span>
                </Link>

                {/* Main Navigation */}
                <nav className="flex items-center gap-1">
                  {/* Primary Actions */}
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-primary transition-colors"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden md:inline">홈</span>
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-primary transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden md:inline">대시보드</span>
                  </Link>
                  
                  {/* Divider */}
                  <div className="h-6 w-px bg-border mx-1" />
                  
                  {/* Secondary Actions */}
                  <Link 
                    href="/weather" 
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-primary transition-colors"
                  >
                    <Sun className="h-4 w-4" />
                    <span className="hidden md:inline">일상</span>
                  </Link>
                  <Link 
                    href="/mypage" 
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-primary transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">내 학습</span>
                  </Link>
                  <Link 
                    href="/mypage/settings" 
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-primary transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden lg:inline">설정</span>
                  </Link>
                </nav>

                {/* Theme Toggle */}
                <HeaderNavSwitch />
              </div>
            </header>
            {/* // header */}

            {/* main */}
            <main className="flex-1">
              {children}
            </main>
            {/* // main */}

            {/* footer */}
            <footer className="border-t">
              <div className="container h-14 flex items-center justify-between text-sm text-muted-foreground">
                <span>© {new Date().getFullYear()} Second Semester</span>
                <span>v0.5.0</span>
              </div>
            </footer>
            {/* // footer */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
