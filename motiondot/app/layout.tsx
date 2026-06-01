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
    default: 'MotionDot | GIF MP4 WebP 변환기',
    template: '%s | MotionDot',
  },
  description:
    'MotionDot은 TikTok, Instagram Reels, Threads용 GIF/MP4/WebP를 빠르게 변환하는 웹 앱입니다.',
  applicationName: 'MotionDot',
  keywords: [
    'GIF converter',
    'MP4 converter',
    'WebP converter',
    'SNS video export',
    'TikTok',
    'Instagram Reels',
    'Threads',
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
    title: 'MotionDot | GIF MP4 WebP 변환기',
    description:
      'SNS 업로드용 영상 포맷을 빠르게 변환하고, 프리셋과 오버레이 편집으로 바로 내보내세요.',
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
    title: 'MotionDot | GIF MP4 WebP 변환기',
    description:
      'SNS 업로드용 영상 포맷을 빠르게 변환하고, 프리셋과 오버레이 편집으로 바로 내보내세요.',
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
