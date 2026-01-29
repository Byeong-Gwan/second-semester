import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import Link from "next/link";
import { HeaderNavSwitch } from "@/components/HeaderNavSwitch";

export const metadata = {
  title: "Second Semester",
  description: "Virtual semester study planner",
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
                <Link href="/" className="font-semibold hover:opacity-80 transition-opacity">Second Semester</Link>
                <nav className="flex items-center gap-3">
                  <HeaderNavSwitch />
                </nav>
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
                <span>v0.1.2</span>
              </div>
            </footer>
            {/* // footer */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
