// 네이버 뉴스 API를 위한 Next.js API Route
// CORS 문제 해결을 위해 서버 사이드에서 호출

import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

// HTML 태그 및 엔티티 제거 함수
function cleanHtmlText(text: string): string {
  // HTML 태그 제거
  let cleaned = text.replace(/<[^>]*>/g, '');
  
  // HTML 엔티티 디코딩
  const entities: { [key: string]: string } = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  
  Object.keys(entities).forEach(entity => {
    cleaned = cleaned.replace(new RegExp(entity, 'g'), entities[entity]);
  });
  
  return cleaned.trim();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '주요뉴스';
  const display = searchParams.get('display') || '5';

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json(
      { error: '네이버 API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${display}&sort=date`,
      {
        headers: {
          'X-Naver-Client-Id': CLIENT_ID,
          'X-Naver-Client-Secret': CLIENT_SECRET,
        },
      }
    );

    if (!response.ok) {
      throw new Error('네이버 API 호출 실패');
    }

    const data = await response.json();
    
    // HTML 태그 제거
    if (data.items) {
      data.items = data.items.map((item: any) => ({
        ...item,
        title: cleanHtmlText(item.title),
        description: cleanHtmlText(item.description),
      }));
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('뉴스 API 오류:', error);
    return NextResponse.json(
      { error: '뉴스를 가져올 수 없습니다.' },
      { status: 500 }
    );
  }
}
