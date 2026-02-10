"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  MapPin,
  Newspaper,
  ExternalLink,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";

// 날씨 데이터 타입
interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: {
      min: number;
      max: number;
    };
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  }>;
}

// 뉴스 데이터 타입
interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

// 목 데이터 제거 - 실제 API만 사용

function getWeatherIcon(icon: string, size: number = 24) {
  const iconProps = { size, className: "text-current" };
  
  switch (icon) {
    case "clear":
      return <Sun {...iconProps} />;
    case "few-clouds":
      return <Cloud {...iconProps} />;
    case "cloudy":
      return <Cloud {...iconProps} />;
    case "rain":
      return <CloudRain {...iconProps} />;
    case "snow":
      return <CloudSnow {...iconProps} />;
    default:
      return <Sun {...iconProps} />;
  }
}

function getWeatherColor(icon: string) {
  switch (icon) {
    case "clear":
      return "text-yellow-600 dark:text-yellow-400";
    case "few-clouds":
      return "text-blue-600 dark:text-blue-400";
    case "cloudy":
      return "text-gray-600 dark:text-gray-400";
    case "rain":
      return "text-blue-700 dark:text-blue-500";
    case "snow":
      return "text-blue-300 dark:text-blue-200";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
}

function formatNewsTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);

  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return format(date, "M월 d일 HH:mm", { locale: ko });
}

export default function WeatherPage() {
  const [mounted, setMounted] = React.useState(false);
  const [location, setLocation] = React.useState("서울");
  const [weather, setWeather] = React.useState<WeatherData | null>(null);
  const [allNews, setAllNews] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = React.useState(1);
  const [displayCount, setDisplayCount] = React.useState(5); // 모바일: 더보기용
  const isMobile = useIsMobile();
  
  const NEWS_PER_PAGE = 5;
  const totalPages = Math.ceil(allNews.length / NEWS_PER_PAGE);

  React.useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      // 날씨와 뉴스 동시 로딩 (뉴스는 더 많이 가져오기)
      const [weatherData, newsData] = await Promise.all([
        fetch('/api/weather').then(res => res.json()),
        fetch('/api/news?query=주요뉴스&display=20').then(res => res.json()) // 20개 가져오기
      ]);

      if (weatherData.error) {
        throw new Error(weatherData.error);
      }

      setWeather(weatherData);
      setAllNews(newsData.items || []);
    } catch (err: any) {
      console.error('데이터 로딩 오류:', err);
      setError(err.message || 'API 키를 확인하세요. docs/API-SETUP.md를 참고하세요.');
    } finally {
      setLoading(false);
    }
  }
  
  // 표시할 뉴스 계산
  const displayedNews = React.useMemo(() => {
    if (isMobile) {
      // 모바일: 처음부터 displayCount개까지
      return allNews.slice(0, displayCount);
    } else {
      // 웹: 현재 페이지의 5개
      const startIndex = (currentPage - 1) * NEWS_PER_PAGE;
      return allNews.slice(startIndex, startIndex + NEWS_PER_PAGE);
    }
  }, [allNews, isMobile, displayCount, currentPage]);
  
  const handleLoadMore = () => {
    setDisplayCount(prev => prev + NEWS_PER_PAGE);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 뉴스 섹션으로 스크롤
    document.getElementById('news-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted || loading) {
    return (
      <main className="container max-w-6xl py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!weather) {
    return (
      <main className="container max-w-6xl py-8">
        <Card className="border-2 border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-400">
              {error || '데이터를 불러올 수 없습니다.'}
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container max-w-6xl py-8 space-y-8">
      {/* 헤더 */}
      <section className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Cloud className="h-8 w-8 text-primary" />
            <Newspaper className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">일상 정보</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">{location} · 날씨 + 뉴스</p>
            </div>
          </div>
        </div>
      </section>

      {/* 현재 날씨 */}
      <section>
        <Card className="border-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* 왼쪽: 온도 및 날씨 */}
              <div className="flex items-center gap-6">
                <div className={`${getWeatherColor(weather.current.icon)}`}>
                  {getWeatherIcon(weather.current.icon, 80)}
                </div>
                <div>
                  <div className="text-6xl font-bold">{weather.current.temp}°</div>
                  <div className="text-xl text-muted-foreground mt-2">
                    {weather.current.description}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    체감 {weather.current.feelsLike}°
                  </div>
                </div>
              </div>

              {/* 오른쪽: 상세 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">습도</div>
                    <div className="text-lg font-semibold">{weather.current.humidity}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Wind className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">풍속</div>
                    <div className="text-lg font-semibold">{weather.current.windSpeed}m/s</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Gauge className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">기압</div>
                    <div className="text-lg font-semibold">{weather.current.pressure}hPa</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <Eye className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">가시거리</div>
                    <div className="text-lg font-semibold">{weather.current.visibility}km</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 주간 예보 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">주간 예보</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {weather.forecast.map((day, index) => {
            const date = new Date(day.date);
            const isToday = index === 0;
            
            return (
              <Card
                key={day.date}
                className={`border-2 hover:shadow-lg transition-all ${
                  isToday 
                    ? "bg-primary/5 border-primary ring-2 ring-primary/20" 
                    : "hover:border-primary/50"
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-center">
                    {isToday ? "오늘" : format(date, "EEE", { locale: ko })}
                  </CardTitle>
                  <div className="text-xs text-center text-muted-foreground">
                    {format(date, "M/d")}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className={`flex justify-center ${getWeatherColor(day.icon)}`}>
                    {getWeatherIcon(day.icon, 40)}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">
                      {day.description}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-bold text-red-600 dark:text-red-400">
                        {day.temp.max}°
                      </span>
                      <span className="text-sm text-muted-foreground">/</span>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {day.temp.min}°
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">습도</span>
                      <span className="font-medium">{day.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">풍속</span>
                      <span className="font-medium">{day.windSpeed}m/s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 주요 뉴스 */}
      <section id="news-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Newspaper className="h-6 w-6" />
            주요 뉴스
          </h2>
          <Badge variant="secondary">네이버 뉴스 API</Badge>
        </div>
        
        <div className="space-y-3">
          {displayedNews.length > 0 ? (
            displayedNews.map((newsItem: NewsItem, index: number) => (
              <a
                key={index}
                href={newsItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="border-2 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                          {newsItem.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {newsItem.description}
                        </p>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatNewsTime(newsItem.pubDate)}</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))
          ) : (
            <Card className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
              <CardContent className="py-8 text-center">
                <Newspaper className="h-12 w-12 mx-auto mb-3 text-yellow-600 opacity-50" />
                <p className="text-yellow-800 dark:text-yellow-400 font-medium">
                  뉴스를 불러올 수 없습니다
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-500 mt-2">
                  네이버 API 키를 확인하세요
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* 페이지네이션 */}
        {allNews.length > 0 && (
          <div className="mt-6">
            {isMobile ? (
              // 모바일: 더보기 버튼
              displayCount < allNews.length && (
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  더보기 ({allNews.length - displayCount}개 남음)
                </Button>
              )
            ) : (
              // 웹: 페이지 버튼
              totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="icon"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="icon"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* API 연동 가이드 */}
      <section>
        <Card className="border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              실제 데이터 연동 방법
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">OpenWeatherMap API (추천)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                ✅ 완전 무료 (하루 1000개 요청)
                <br />
                ✅ 저작권 문제 없음
                <br />
                ✅ 현재 날씨 + 7일 예보
              </p>
              <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">
                {`// 1. https://openweathermap.org 가입
                  // 2. API 키 발급 (무료)
                  // 3. 환경 변수 설정
                  NEXT_PUBLIC_WEATHER_API_KEY=your_api_key

                  // 4. 현재 날씨
                  fetch('https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=YOUR_KEY&units=metric&lang=kr')

                  // 5. 7일 예보
                  fetch('https://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=YOUR_KEY&units=metric&lang=kr')`}
              </code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">기상청 API (한국 전용)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                ✅ 공공데이터 (무료)
                <br />
                ✅ 한국 날씨 정확도 높음
              </p>
              <code className="block bg-muted p-3 rounded text-xs">
                https://www.data.go.kr/data/15084084/openapi.do
              </code>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">네이버 뉴스 검색 API (추천)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                ✅ 완전 무료 (하루 25,000개 요청)
                <br />
                ✅ 저작권 문제 없음 (제목 + 요약만)
                <br />
                ✅ 한국 뉴스 최강 (모든 언론사)
              </p>
              <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">
                {`// 1. https://developers.naver.com 가입
// 2. 애플리케이션 등록 (Client ID, Secret 발급)
// 3. 환경 변수 설정
NEXT_PUBLIC_NAVER_CLIENT_ID=your_client_id
NEXT_PUBLIC_NAVER_CLIENT_SECRET=your_client_secret

// 4. 뉴스 검색
fetch('https://openapi.naver.com/v1/search/news.json?query=주요뉴스&display=10&sort=date', {
  headers: {
    'X-Naver-Client-Id': CLIENT_ID,
    'X-Naver-Client-Secret': CLIENT_SECRET
  }
})`}
              </code>
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                💡 <strong>현재는 샘플 데이터</strong>를 표시하고 있습니다. 
                실제 날씨와 뉴스를 보려면 위 API를 연동하세요.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
