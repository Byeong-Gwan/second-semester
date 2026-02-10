import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingButton({ onClick, className }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "h-14 w-14 rounded-full",
        "bg-primary text-primary-foreground",
        "shadow-lg hover:shadow-xl",
        "hover:scale-110 active:scale-95",
        "transition-all duration-200",
        "flex items-center justify-center",
        "group",
        className
      )}
      aria-label="할 일 추가"
    >
      <Plus size={24} className="group-hover:rotate-90 transition-transform duration-200" />
    </button>
  );
}
