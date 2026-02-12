import { Metadata } from "next";
import { generateMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generateMetadata({
  title: "성과 리포트",
  description: "학습 성과를 종합적으로 분석합니다. 생산성 점수, 핵심 지표, 차트 분석, 인사이트 및 개선 제안을 확인하세요.",
  keywords: ["성과 리포트", "학습 분석", "생산성 점수", "통계 분석", "인사이트"],
  path: "/mypage/report",
});
