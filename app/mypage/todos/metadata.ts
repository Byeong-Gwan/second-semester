import { Metadata } from "next";
import { generateMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generateMetadata({
  title: "할 일 관리",
  description: "월간 달력으로 할 일을 관리하세요. 우선순위 설정, 필터링, 검색 기능으로 효율적인 할 일 관리가 가능합니다.",
  keywords: ["할 일 관리", "투두리스트", "작업 관리", "우선순위", "일정 관리"],
  path: "/mypage/todos",
});
