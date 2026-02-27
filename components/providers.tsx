"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/error-boundary";
import { SyncProvider } from "@/components/SyncProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ErrorBoundary>
          <ToastProvider>
            <SyncProvider>
              {children}
            </SyncProvider>
          </ToastProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SessionProvider>
  );
}
