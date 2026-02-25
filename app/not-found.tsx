import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container max-w-2xl py-20 px-4 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-7xl font-extrabold text-primary">404</h1>
        <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
        <p className="text-muted-foreground">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px]"
        >
          홈으로 이동
        </Link>
        <Link
          href="/daily"
          className="inline-flex items-center rounded-xl bg-muted px-6 py-3 text-sm font-semibold hover:bg-muted/80 transition-colors min-h-[44px]"
        >
          일상 보기
        </Link>
      </div>
    </div>
  );
}
