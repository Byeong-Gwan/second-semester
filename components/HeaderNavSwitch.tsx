"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderNavSwitch() {
  const pathname = usePathname(); // 현재 경로를 반환 (쿼리 파라미터는 없이 오직 현재의 경로만 확인함)
  const onMyPage = pathname === "/mypage" || pathname?.startsWith("/mypage/"); // 현재 경로가 /mypage 또는 /mypage/로 시작하는지 확인
  const label = onMyPage ? "MAIN" : "MY"; // true면 "MAIN", false면 "MY"
  const href = onMyPage ? "/" : "/mypage"; // true면 "/", false면 "/mypage"
  return (
    <Link href={href} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
      {label}
    </Link>
  );
}
