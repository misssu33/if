import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://motiondot.vercel.app'),
  title: {
    default: 'MotionDot | TikTok 제휴 숏폼 GIF·MP4·WebP',
    template: '%s | MotionDot',
  },
  description:
    'TikTok 제휴 크리에이터를 위한 9:16 숏폼 광고 제작. 꿀템·후기·훅 템플릿으로 GIF·MP4·WebP를 모바일에서 빠르게 반복 export.',
  applicationName: 'MotionDot',
  keywords: [
    'TikTok affiliate',
    'TikTok 제휴',
    'short-form commerce',
    'GIF converter',
    'MP4 converter',
    'WebP converter',
    '9:16 vertical video',
    'Instagram Reels',
  ],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/app-icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    title: 'MotionDot | TikTok 제휴 숏폼 GIF·MP4·WebP',
    description:
      '9:16 TikTok 제휴 제품 영상·GIF·MP4·WebP를 모바일에서 빠르게 만들고 반복 export 하세요.',
    siteName: 'MotionDot',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'MotionDot Open Graph 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MotionDot | TikTok 제휴 숏폼 GIF·MP4·WebP',
    description:
      '9:16 TikTok 제휴 제품 영상·GIF·MP4·WebP를 모바일에서 빠르게 만들고 반복 export 하세요.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#111827',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-hidden antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
