import { Metadata } from "next";
import { generateMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = generateMetadata({
  title: "내 학습",
  description: "내 학습 목록을 관리하고 진행 상황을 추적하세요. 학습 생성, 수정, 삭제 및 진척도 관리가 가능합니다.",
  keywords: ["학습 관리", "내 학습", "학습 목록", "진척도 관리"],
  path: "/mypage",
});
