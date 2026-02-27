"use client";

import { useSession, signIn } from "next-auth/react";
import { usePathname } from "next/navigation";

const PUBLIC_PATHS = ["/login", "/api"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isPublicPath || status === "loading" || session) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="pointer-events-none select-none blur-sm opacity-50">
        {children}
      </div>

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="mx-4 w-full max-w-sm rounded-2xl border bg-background p-6 shadow-2xl space-y-5">
          <div className="text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
              <span className="text-white font-extrabold text-xl">2S</span>
            </div>
            <h2 className="text-xl font-bold">로그인이 필요합니다</h2>
            <p className="text-sm text-muted-foreground">
              Second Semester의 모든 기능을 사용하려면<br />로그인해주세요.
            </p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: pathname })}
            className="w-full flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-3.5 text-sm font-semibold hover:bg-muted transition-colors min-h-[52px]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google로 로그인
          </button>

          <p className="text-[11px] text-center text-muted-foreground">
            로그인하면 여러 기기에서 데이터를 동기화할 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
}
