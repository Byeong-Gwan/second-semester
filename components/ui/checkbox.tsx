"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Checkbox({ checked, onCheckedChange, className }: { checked?: boolean; onCheckedChange?: (c: boolean) => void; className?: string }) {
  const [internal, setInternal] = React.useState(!!checked);
  React.useEffect(() => setInternal(!!checked), [checked]);
  return (
    <button
      type="button"
      onClick={() => {
        const next = !internal;
        setInternal(next);
        onCheckedChange?.(next);
      }}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded border border-input bg-background text-primary ring-offset-background transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        internal && "bg-primary text-primary-foreground"
      )}
      aria-checked={internal}
      role="checkbox"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" className="fill-current">
        {internal ? <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none"/> : null}
      </svg>
    </button>
  );
}
