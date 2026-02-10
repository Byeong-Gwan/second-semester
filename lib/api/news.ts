// 네이버 뉴스 검색 API 연동

const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;

export interface NewsItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

export async function fetchNews(query: string = '주요뉴스', display: number = 5): Promise<NewsItem[]> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('네이버 API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.');
  }

  try {
    // 네이버 API는 CORS 문제로 서버 사이드에서 호출해야 함
    // Next.js API Route를 통해 호출
    const response = await fetch(`/api/news?query=${encodeURIComponent(query)}&display=${display}`);

    if (!response.ok) {
      throw new Error('뉴스 데이터를 가져올 수 없습니다.');
    }

    const data = await response.json();

    // HTML 태그 제거 및 파싱
    return data.items.map((item: any) => ({
      title: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
      description: item.description.replace(/<[^>]*>/g, ''),
      link: item.link,
      pubDate: item.pubDate,
    }));
  } catch (error) {
    console.error('뉴스 API 오류:', error);
    throw error;
  }
}
