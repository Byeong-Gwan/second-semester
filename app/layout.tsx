import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import Link from "next/link";
import { HeaderNavSwitch } from "@/components/HeaderNavSwitch";

export const metadata = {
  title: "Second Semester",
  description: "Virtual semester study planner",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="min-h-dvh flex flex-col">
            {/* header */}
            <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container h-14 flex items-center justify-between">
                <nav className="flex items-center gap-6">
                  <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                    홈
                  </Link>
                  <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                    대시보드
                  </Link>
                  <Link href="/weather" className="text-sm font-medium hover:text-primary transition-colors">
                    일상
                  </Link>
                  <Link href="/mypage" className="text-sm font-medium hover:text-primary transition-colors">
                    마이페이지
                  </Link>
                  <Link href="/mypage/settings" className="text-sm font-medium hover:text-primary transition-colors">
                    설정
                  </Link>
                </nav>
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
                <span> {new Date().getFullYear()} Second Semester</span>
                <span>v0.4.0</span>
              </div>
            </footer>
            {/* // footer */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
