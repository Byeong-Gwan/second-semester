import { Metadata } from "next";
import { generateMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generateMetadata({
  title: "대시보드",
  description: "학습 진행률, 출석 통계, 할 일 완료율을 한눈에 확인하세요. 실시간 차트와 분석으로 학습 성과를 추적합니다.",
  keywords: ["대시보드", "학습 통계", "진행률 분석", "출석 통계", "성과 분석"],
  path: "/dashboard",
});
