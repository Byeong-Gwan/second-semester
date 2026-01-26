import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "outline" | "destructive" | "success" }) {
  const variants: Record<string, string> = {
    default: "bg-primary/90 text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-emerald-600 text-emerald-50",
  };
  return <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)} {...props} />;
}
