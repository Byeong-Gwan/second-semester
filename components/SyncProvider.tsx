"use client";

import { useSync } from "@/lib/hooks/useSync";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  useSync();
  return <>{children}</>;
}
