import { Metadata } from "next";
import { generateMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generateMetadata({
  title: "출석 관리",
  description: "월간 출석 캘린더와 통계를 확인하세요. 연속 출석 기록, 출석률, 결석 현황을 한눈에 파악할 수 있습니다.",
  keywords: ["출석 체크", "출석 관리", "출석률", "연속 출석", "출석 통계"],
  path: "/mypage/attendance",
});
