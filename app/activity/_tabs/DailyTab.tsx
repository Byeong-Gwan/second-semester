"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cloud, Newspaper, ExternalLink, MapPin, Thermometer, Wind, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  link?: string;
}

export default function DailyTab() {
  const [weather, setWeather] = React.useState<WeatherSimple | null>(null);
  const [news, setNews] = React.useState<NewsItem[]>([]);
  const [weatherLoading, setWeatherLoading] = React.useState(true);
  const [newsLoading, setNewsLoading] = React.useState(true);

  React.useEffect(() => {
    // 날씨 API 호출
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.main) {
          setWeather({
            temp: Math.round(data.main.temp),
            description: data.weather?.[0]?.description || "맑음",
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind?.speed || 0),
            city: data.name || "서울",
          });
        }
      })
      .catch(() => {})
      .finally(() => setWeatherLoading(false));

    // 뉴스 API 호출
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data.slice(0, 5));
        }
      })
      .catch(() => {})
      .finally(() => setNewsLoading(false));
  }, []);

  return (
    <div className="space-y-4">
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
                <div className="h-8 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </CardContent>
          </Card>
        ) : weather ? (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {weather.city}
                  </div>
                  <div className="text-4xl font-bold">{weather.temp}°</div>
                  <div className="text-sm text-muted-foreground mt-1">{weather.description}</div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-end">
                    <Droplets className="h-4 w-4 text-blue-400" />
                    {weather.humidity}%
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-end">
                    <Wind className="h-4 w-4 text-gray-400" />
                    {weather.windSpeed}m/s
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
          <Card>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : news.length > 0 ? (
          <div className="space-y-2">
            {news.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-3">
                  <a
                    href={item.link || item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        <span className="text-xs text-muted-foreground">{item.source}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
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
