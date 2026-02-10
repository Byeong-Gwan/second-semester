"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Newspaper, TrendingUp, Clock } from "lucide-react";

// 뉴스 데이터 타입
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: "정치" | "경제" | "사회" | "국제" | "문화";
  publishedAt: string;
  url: string;
  isEditorial: boolean;
}

// 임시 뉴스 데이터 (실제로는 API에서 가져와야 함)
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "[사설] 디지털 전환 시대, 교육 혁신이 시급하다",
    summary: "인공지능과 디지털 기술의 발전으로 교육 현장의 변화가 불가피해졌다. 단순 암기식 교육에서 벗어나 창의성과 문제해결 능력을 키우는 교육으로의 전환이 필요한 시점이다.",
    source: "조선일보",
    category: "사회",
    publishedAt: "2026-02-09T09:00:00",
    url: "#",
    isEditorial: true,
  },
  {
    id: "2",
    title: "[사설] 청년 실업 해소, 정부와 기업의 협력이 답이다",
    summary: "청년 실업률이 여전히 높은 수준을 유지하고 있다. 정부의 일자리 정책과 기업의 적극적인 채용이 맞물려야 청년들에게 희망을 줄 수 있다.",
    source: "중앙일보",
    category: "경제",
    publishedAt: "2026-02-09T08:30:00",
    url: "#",
    isEditorial: true,
  },
  {
    id: "3",
    title: "[사설] 기후 위기 대응, 더 이상 미룰 수 없다",
    summary: "전 세계적으로 이상기후 현상이 빈번해지고 있다. 탄소 중립 목표 달성을 위한 실질적인 행동이 시급하며, 모든 국가의 협력이 필요하다.",
    source: "한겨레",
    category: "국제",
    publishedAt: "2026-02-09T08:00:00",
    url: "#",
    isEditorial: true,
  },
  {
    id: "4",
    title: "[사설] 저출산 극복, 육아 지원 확대가 우선이다",
    summary: "저출산 문제가 국가적 위기로 대두되고 있다. 출산 장려금보다는 실질적인 육아 지원과 일-가정 양립 정책이 더 효과적일 것이다.",
    source: "동아일보",
    category: "사회",
    publishedAt: "2026-02-09T07:30:00",
    url: "#",
    isEditorial: true,
  },
  {
    id: "5",
    title: "[사설] 반도체 산업 경쟁력 강화, 인재 양성이 핵심",
    summary: "글로벌 반도체 경쟁이 치열해지는 가운데, 우리나라의 경쟁력 유지를 위해서는 우수한 인재 양성과 연구개발 투자 확대가 필수적이다.",
    source: "매일경제",
    category: "경제",
    publishedAt: "2026-02-09T07:00:00",
    url: "#",
    isEditorial: true,
  },
];

const categoryColors = {
  정치: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-500",
  경제: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400 border-green-500",
  사회: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400 border-yellow-500",
  국제: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-500",
  문화: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-500",
};

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("전체");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="container max-w-6xl py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-muted rounded-lg" />
          <div className="space-y-4">
            <div className="h-40 bg-muted rounded-lg" />
            <div className="h-40 bg-muted rounded-lg" />
            <div className="h-40 bg-muted rounded-lg" />
          </div>
        </div>
      </main>
    );
  }

  const filteredNews = selectedCategory === "전체" 
    ? mockNews 
    : mockNews.filter(news => news.category === selectedCategory);

  const categories = ["전체", "정치", "경제", "사회", "국제", "문화"];

  return (
    <main className="container max-w-6xl py-8 space-y-8">
      {/* 헤더 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold tracking-tight">오늘의 주요 뉴스</h1>
            <p className="text-lg text-muted-foreground mt-1">
              사설 및 주요 이슈 중심
            </p>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* 안내 카드 */}
      <Card className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-400 mb-1">
                뉴스 API 연동 필요
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-500">
                현재는 샘플 데이터를 표시하고 있습니다. 실제 뉴스를 보려면 뉴스 API를 연동해야 합니다.
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-600 mt-2">
                추천: NewsAPI, Google News RSS, 네이버 뉴스 API 등
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 뉴스 리스트 */}
      <section className="space-y-4">
        {filteredNews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Newspaper className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>해당 카테고리의 뉴스가 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          filteredNews.map((news) => (
            <Card
              key={news.id}
              className="border-2 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {news.isEditorial && (
                        <Badge variant="outline" className="bg-red-100 border-red-500 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-semibold">
                          사설
                        </Badge>
                      )}
                      <Badge variant="outline" className={categoryColors[news.category]}>
                        {news.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{news.source}</span>
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">
                      {news.title}
                    </CardTitle>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  {news.summary}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(news.publishedAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {/* API 연동 가이드 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              실제 뉴스 연동 방법
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. NewsAPI 사용 (추천)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                무료 플랜으로 하루 100개 요청 가능
              </p>
              <code className="block bg-muted p-3 rounded text-xs">
                https://newsapi.org/v2/top-headlines?country=kr&apiKey=YOUR_API_KEY
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Google News RSS</h3>
              <p className="text-sm text-muted-foreground mb-2">
                무료, API 키 불필요
              </p>
              <code className="block bg-muted p-3 rounded text-xs">
                https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. 네이버 뉴스 API</h3>
              <p className="text-sm text-muted-foreground mb-2">
                네이버 개발자 센터에서 API 키 발급
              </p>
              <code className="block bg-muted p-3 rounded text-xs">
                https://openapi.naver.com/v1/search/news.json
              </code>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}
