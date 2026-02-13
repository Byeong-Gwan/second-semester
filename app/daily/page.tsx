"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Newspaper, ExternalLink, MapPin, Wind, Droplets } from "lucide-react";
import Link from "next/link";

interface WeatherSimple {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  url: string;
}

export default function DailyPage() {
  const [weather, setWeather] = React.useState<WeatherSimple | null>(null);
  const [news, setNews] = React.useState<any[]>([]);
  const [weatherLoading, setWeatherLoading] = React.useState(true);
  const [newsLoading, setNewsLoading] = React.useState(true);
  const [newsDisplayCount, setNewsDisplayCount] = React.useState(5);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setNewsDisplayCount(mobile ? 5 : 8);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.current) {
          setWeather({
            temp: data.current.temp,
            description: data.current.description || "맑음",
            humidity: data.current.humidity,
            windSpeed: data.current.windSpeed || 0,
            city: "서울",
          });
        }
      })
      .catch(() => {})
      .finally(() => setWeatherLoading(false));

    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setNews(data.items);
        }
      })
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  return (
    <div className="container max-w-3xl py-6 px-4 space-y-6">
      {/* 날씨 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            날씨
          </h2>
          <Link href="/weather" className="text-sm text-primary font-medium">
            상세 보기 →
          </Link>
        </div>

        {weatherLoading ? (
          <Card>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ) : weather ? (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {weather.city}
                  </div>
                  <div className="text-5xl font-bold">{weather.temp}°</div>
                  <div className="text-sm text-muted-foreground mt-1">{weather.description}</div>
                </div>
                <div className="space-y-3 text-right">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    습도 {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                    <Wind className="h-4 w-4 text-gray-400" />
                    바람 {weather.windSpeed}m/s
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              날씨 정보를 불러올 수 없습니다.
              <Link href="/weather" className="text-primary ml-1">직접 확인하기 →</Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* 뉴스 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-purple-500" />
            뉴스
          </h2>
          <Link href="/news" className="text-sm text-primary font-medium">
            전체 보기 →
          </Link>
        </div>

        {newsLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : news.length > 0 ? (
          <>
            <div className="space-y-2">
              {news.slice(0, newsDisplayCount).map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="outline" className="text-xs">{item.category || '뉴스'}</Badge>
                          <span className="text-xs text-muted-foreground">{item.source}</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {newsDisplayCount < news.length && (
              <div className="text-center pt-2">
                <button
                  onClick={() => setNewsDisplayCount(prev => prev + (isMobile ? 5 : 8))}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all min-h-[52px]"
                >
                  더보기
                  <ExternalLink className="h-5 w-5" />
                </button>
                <p className="text-sm text-muted-foreground mt-2">
                  현재 {newsDisplayCount}개 / 전체 {news.length}개
                </p>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              뉴스를 불러올 수 없습니다.
              <Link href="/news" className="text-primary ml-1">직접 확인하기 →</Link>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
