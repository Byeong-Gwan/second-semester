// OpenWeatherMap API를 위한 Next.js API Route

import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function mapWeatherIcon(iconCode: string): string {
  if (iconCode.startsWith('01')) return 'clear';
  if (iconCode.startsWith('02')) return 'few-clouds';
  if (iconCode.startsWith('03') || iconCode.startsWith('04')) return 'cloudy';
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return 'rain';
  if (iconCode.startsWith('13')) return 'snow';
  return 'clear';
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const city = searchParams.get('city') || 'Seoul';

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'OpenWeatherMap API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.' },
      { status: 500 }
    );
  }

  try {
    // 현재 날씨
    const currentResponse = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=kr`
    );

    if (!currentResponse.ok) {
      throw new Error('날씨 데이터를 가져올 수 없습니다.');
    }

    const currentData = await currentResponse.json();

    // 5일 예보
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=kr`
    );

    if (!forecastResponse.ok) {
      throw new Error('예보 데이터를 가져올 수 없습니다.');
    }

    const forecastData = await forecastResponse.json();

    // 현재 날씨 파싱
    const current = {
      temp: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 10) / 10,
      pressure: currentData.main.pressure,
      visibility: Math.round(currentData.visibility / 1000),
      description: currentData.weather[0].description,
      icon: mapWeatherIcon(currentData.weather[0].icon),
    };

    // 예보 데이터 파싱 (일별로 그룹화)
    const dailyForecasts: { [key: string]: any[] } = {};
    
    forecastData.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = [];
      }
      dailyForecasts[date].push(item);
    });

    // 7일 예보 생성
    const forecast = Object.keys(dailyForecasts)
      .slice(0, 7)
      .map((date) => {
        const dayData = dailyForecasts[date];
        const temps = dayData.map((d: any) => d.main.temp);
        const humidities = dayData.map((d: any) => d.main.humidity);
        const windSpeeds = dayData.map((d: any) => d.wind.speed);
        
        // 가장 많이 나타나는 날씨 선택
        const weatherCounts: { [key: string]: number } = {};
        dayData.forEach((d: any) => {
          const icon = d.weather[0].icon;
          weatherCounts[icon] = (weatherCounts[icon] || 0) + 1;
        });
        const mostCommonIcon = Object.keys(weatherCounts).reduce((a, b) =>
          weatherCounts[a] > weatherCounts[b] ? a : b
        );
        const weatherDesc = dayData.find((d: any) => d.weather[0].icon === mostCommonIcon)?.weather[0].description;

        return {
          date,
          temp: {
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps)),
          },
          description: weatherDesc || '정보 없음',
          icon: mapWeatherIcon(mostCommonIcon),
          humidity: Math.round(humidities.reduce((a: number, b: number) => a + b, 0) / humidities.length),
          windSpeed: Math.round((windSpeeds.reduce((a: number, b: number) => a + b, 0) / windSpeeds.length) * 10) / 10,
        };
      });

    return NextResponse.json({
      current,
      forecast,
    });
  } catch (error: any) {
    console.error('날씨 API 오류:', error);
    return NextResponse.json(
      { error: error.message || '날씨 데이터를 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}
