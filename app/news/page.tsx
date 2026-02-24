"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Newspaper, TrendingUp, Clock, ArrowRight } from "lucide-react";

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

// 네이버 API 응답 타입
interface NaverNewsResponse {
  items: Array<{
    title: string;
    link: string;
    description: string;
    pubDate: string;
    originallink: string;
  }>;
}

// 네이버 뉴스를 NewsItem으로 변환
function convertNaverNews(item: NaverNewsResponse['items'][0], index: number): NewsItem {
  const source = item.link.includes('news.naver.com') ? 
    item.link.split('.')[1] : '언론사';
  
  const categoryMap: { [key: string]: NewsItem['category'] } = {
    '정치': '정치',
    '경제': '경제', 
    '사회': '사회',
    '국제': '국제',
    '문화': '문화',
  };
  
  // 뉴스 제목에서 카테고리 추출 (간단)
  let category: NewsItem['category'] = '사회';
  for (const [key, value] of Object.entries(categoryMap)) {
    if (item.title.includes(key)) {
      category = value;
      break;
    }
  }
  
  return {
    id: item.link || `news-${index}`,
    title: item.title,
    summary: item.description,
    source,
    category,
    publishedAt: item.pubDate,
    url: item.link,
    isEditorial: item.title.includes('[사설]'),
  };
}

const categoryColors = {
  정치: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-500",
  경제: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400 border-green-500",
  사회: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400 border-yellow-500",
  국제: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-500",
  문화: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-500",
};

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("전체");
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [displayCount, setDisplayCount] = React.useState(5);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setDisplayCount(window.innerWidth < 768 ? 5 : 20);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data: NaverNewsResponse) => {
        if (data.items) {
          const convertedNews = data.items.map((item, index) => convertNaverNews(item, index));
          setNews(convertedNews);
        }
      })
      .catch((err) => {
        console.error('뉴스 로딩 실패:', err);
        setError('뉴스를 불러올 수 없습니다.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
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

  if (error) {
    return (
      <main className="container max-w-6xl py-8">
        <div className="text-center py-20">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  const filteredNews = selectedCategory === "전체" 
    ? news 
    : news.filter((item: NewsItem) => item.category === selectedCategory);

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
          <>
            {/* 뉴스 목록 */}
            <div className="space-y-4">
              {filteredNews.slice(0, displayCount).map((news) => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card
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
                </a>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {displayCount < filteredNews.length && (
              <div className="text-center">
                <button
                  onClick={() => setDisplayCount(prev => prev + (isMobile ? 5 : 20))}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all min-h-[52px]"
                >
                  더보기
                  <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-sm text-muted-foreground mt-2">
                  현재 {displayCount}개 / 전체 {filteredNews.length}개
                </p>
              </div>
            )}
          </>
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
