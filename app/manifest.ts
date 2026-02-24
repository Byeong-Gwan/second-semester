import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Second Semester - 학습 관리 플래너',
    short_name: 'Second Semester',
    description: '학습, 할 일, 출석, 일정을 한 곳에서 관리하는 스마트 학습 플래너',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icon-192.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ],
    categories: ['education', 'productivity', 'lifestyle'],
    lang: 'ko',
    dir: 'ltr'
  }
}
