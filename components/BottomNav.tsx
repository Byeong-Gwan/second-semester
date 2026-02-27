"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Layers, Sun, Settings } from "lucide-react";
import React from "react";
import { useGlobalPopupState } from "@/lib/hooks/usePopupState";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "오늘" },
  { href: "/activity", icon: Layers, label: "활동" },
  { href: "/daily", icon: Sun, label: "일상" },
  { href: "/settings", icon: Settings, label: "설정" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { shouldHideBottomNav } = useGlobalPopupState();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const touchedRef = React.useRef(false);

  const handleNav = (href: string) => {
    if (pathname !== href) router.push(href);
  };

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t bg-background safe-area-bottom transition-transform duration-300 ${
        shouldHideBottomNav ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div className="flex items-stretch justify-around h-[68px] max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <button
              key={item.href}
              type="button"
              onClick={() => {
                if (!touchedRef.current) handleNav(item.href);
                touchedRef.current = false;
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                touchedRef.current = true;
                handleNav(item.href);
              }}
              className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[48px] select-none touch-manipulation cursor-pointer ${
                active
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              }`}
              style={{ WebkitTouchCallout: "none", userSelect: "none" }}
            >
              <Icon className={`h-6 w-6 ${active ? "stroke-[2.5]" : ""}`} />
              <span className={`text-xs ${active ? "font-semibold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
