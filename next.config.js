/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
      {
        source: '/mypage/todos',
        destination: '/activity?tab=todos',
        permanent: true,
      },
      {
        source: '/mypage/attendance',
        destination: '/activity?tab=attendance',
        permanent: true,
      },
      {
        source: '/mypage/reflection',
        destination: '/activity?tab=reflection',
        permanent: true,
      },
      {
        source: '/mypage/study-log',
        destination: '/activity?tab=study-log',
        permanent: true,
      },
      {
        source: '/mypage/settings',
        destination: '/settings',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
