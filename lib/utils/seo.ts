import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: "website" | "article";
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://second-semester.vercel.app";
const siteName = "Second Semester";
const defaultDescription = "학습, 일정, 할 일, 출석을 한눈에 관리하는 스마트 학습 플래너";
const defaultImage = "/og-image.png";

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    path = "",
    image = defaultImage,
    type = "website",
  } = config;

  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;
  const url = `${baseUrl}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "학습 플래너",
      "할 일 관리",
      "출석 체크",
      "학습 관리",
      "스터디 플래너",
      "일정 관리",
      "생산성 도구",
      ...keywords,
    ],
    authors: [{ name: "Second Semester Team" }],
    creator: "Second Semester",
    publisher: "Second Semester",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "ko_KR",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@secondsemester",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      other: {
        "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION || "",
      },
    },
  };
}

export function generateStructuredData(type: "WebSite" | "WebApplication" | "Article", data?: any) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    name: siteName,
    url: baseUrl,
    description: defaultDescription,
    inLanguage: "ko-KR",
  };

  if (type === "WebSite") {
    return {
      ...baseStructuredData,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };
  }

  if (type === "WebApplication") {
    return {
      ...baseStructuredData,
      "@type": "WebApplication",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KRW",
      },
      featureList: [
        "학습 관리",
        "할 일 관리",
        "출석 체크",
        "일정 관리",
        "통계 대시보드",
        "성과 리포트",
      ],
    };
  }

  if (type === "Article" && data) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      datePublished: data.datePublished,
      dateModified: data.dateModified || data.datePublished,
      author: {
        "@type": "Person",
        name: "Second Semester Team",
      },
      publisher: {
        "@type": "Organization",
        name: siteName,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
      },
    };
  }

  return baseStructuredData;
}
