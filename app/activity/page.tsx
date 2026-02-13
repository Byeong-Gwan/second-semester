"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, CheckSquare, UserCheck, PenLine, Clock } from "lucide-react";

// 탭별 컴포넌트 lazy import
import LearningTab from "./_tabs/LearningTab";
import TodosTab from "./_tabs/TodosTab";
import AttendanceTab from "./_tabs/AttendanceTab";
import ReflectionTab from "./_tabs/ReflectionTab";
import StudyLogTab from "./_tabs/StudyLogTab";

const TABS = [
  { id: "learning", label: "학습", icon: BookOpen },
  { id: "todos", label: "할 일", icon: CheckSquare },
  { id: "attendance", label: "출석", icon: UserCheck },
  { id: "reflection", label: "회고", icon: PenLine },
  { id: "study-log", label: "일지", icon: Clock },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ActivityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TabId | null;
  const [activeTab, setActiveTab] = React.useState<TabId>(tabParam || "learning");

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    router.replace(`/activity?tab=${tab}`, { scroll: false });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "learning":
        return <LearningTab />;
      case "todos":
        return <TodosTab />;
      case "attendance":
        return <AttendanceTab />;
      case "reflection":
        return <ReflectionTab />;
      case "study-log":
        return <StudyLogTab />;
      default:
        return <LearningTab />;
    }
  };

  return (
    <div className="container max-w-3xl py-4 px-4 sm:px-6 space-y-4">
      {/* 탭 네비게이션 */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all min-h-[44px] ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 탭 콘텐츠 */}
      {renderTab()}
    </div>
  );
}
