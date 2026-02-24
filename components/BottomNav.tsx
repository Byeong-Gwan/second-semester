"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Sun, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "오늘" },
  { href: "/activity", icon: Layers, label: "활동" },
  { href: "/daily", icon: Sun, label: "일상" },
  { href: "/settings", icon: Settings, label: "설정" },
];

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background safe-area-bottom" style={{ WebkitTapHighlightColor: 'transparent' }}>
      <div className="flex items-center justify-around h-[68px] max-w-lg mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-full min-h-[56px] py-2 rounded-xl transition-colors touch-manipulation ${
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground active:bg-muted"
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
