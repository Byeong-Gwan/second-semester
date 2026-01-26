"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR 단계에서는 테마를 알 수 없어 클라이언트와 불일치가 날 수 있어요.
  // 마운트 이후에만 실제 아이콘/텍스트를 렌더링해 수화 에러를 방지합니다.
  const current = (mounted ? (theme === "system" ? resolvedTheme : theme) : undefined) as
    | "light"
    | "dark"
    | undefined;
  const isDark = current === "dark";

  return (
    <button
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {mounted ? (isDark ? <Sun size={16} /> : <Moon size={16} />) : <span className="inline-block h-4 w-4" />}
      <span>{mounted ? (isDark ? "라이트" : "다크") : "테마"}</span>
    </button>
  );
}
