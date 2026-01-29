"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function HeaderNavSwitch() {
  const pathname = usePathname();
  const onMyPage = pathname === "/mypage" || pathname?.startsWith("/mypage/");
  const label = onMyPage ? "MAIN" : "MY";
  const href = onMyPage ? "/" : "/mypage";
  return (
    <Link href={href} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
      {label}
    </Link>
  );
}
